import { Component, computed, effect, inject, input, signal, type OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ThemeService } from '@/core/services/theme.service';

import { LayoutComponent } from '@/pages/layout';
import { ButtonComponent, EmptyComponent } from '@/shared/ui';

import { ChallengesService } from '../../services';

import { stringifyLog } from './code-editor-page.utilities';

import { TERMINAL_TAB_IDS, type TerminalTabIds } from './code-edit-page.constants';

import {
  WORKER_MODE,
  LOG_TYPE,
  type Log,
  type TestCase,
  type TestConsoleLine,
  type TestTerminalRow,
  type WorkerOnMessage,
} from './code-edit-page.types';

const MONACO_RS_THEME = 'rs-tandem-challenges-theme';
const MONACO_FALLBACK_BACKGROUND = '#222222';
const MONACO_LONG_HEX_COLOR_PATTERN = /^#([\da-f]{6}|[\da-f]{8})$/i;
const MONACO_SHORT_HEX_COLOR_PATTERN = /^#([\da-f]{3}|[\da-f]{4})$/i;

interface MonacoInstance {
  editor: Pick<typeof import('monaco-editor').editor, 'defineTheme' | 'setTheme'>;
}

@Component({
  selector: 'app-code-editor-page',
  imports: [
    ButtonComponent,
    EmptyComponent,
    FormsModule,
    LayoutComponent,
    MonacoEditorModule,
    TitleCasePipe,
  ],
  templateUrl: './code-editor-page.component.html',
  styleUrl: './code-editor-page.component.scss',
  standalone: true,
})
export class CodeEditorPageComponent implements OnInit {
  readonly challengesService = inject(ChallengesService);
  readonly themeService = inject(ThemeService);
  readonly categoryId = input.required<string>();
  readonly topicId = input.required<string>();

  readonly editorOptions = {
    language: 'javascript',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    padding: { top: 16, bottom: 16 },
    fontFamily: 'Roboto Mono, monospace',
    lineHeight: 20,
    fontSize: 14,
    wordWrap: 'on',
    wrappingIndent: 'indent',
    theme: MONACO_RS_THEME,
  };

  readonly logs = signal<Omit<Log, 'mode'>[]>([]);
  readonly tests = signal<TestTerminalRow[]>([]);

  readonly solutions: string[] = [];

  readonly areInstructionsShown = signal<boolean>(true);
  readonly isCodeExecuting = signal<boolean>(false);
  readonly canSubmitSolution = signal<boolean>(false);

  private readonly _activeTerminalId = signal<TerminalTabIds>(TERMINAL_TAB_IDS.console);
  private _worker: Worker | null = null;
  private _codeExecutingTimeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly terminateState = computed(() => {
    const activeTerminalId = this._activeTerminalId();

    return {
      isConsoleActive: activeTerminalId === TERMINAL_TAB_IDS.console,
      areTestsActive: activeTerminalId === TERMINAL_TAB_IDS.tests,
    };
  });

  constructor() {
    effect(() => {
      this.themeService.theme();

      queueMicrotask(() => {
        this._applyMonacoTheme();
      });
    });
  }

  ngOnInit() {
    if (this.challengesService.codeEditor()?.status === 'notStarted') {
      this.challengesService.postTopicStatus(this.categoryId(), this.topicId(), 'inProgress');
    }
  }

  onEditorInit() {
    this._applyMonacoTheme();
  }

  onTerminalTabButtonClick(tabId: TerminalTabIds) {
    this._activeTerminalId.set(tabId);
  }

  onInstructionsButtonClick() {
    this.areInstructionsShown.update((state) => !state);
  }

  onCodeChange() {
    const code = this.challengesService.codeEditor()?.starterCode.replace(/\s/g, '') ?? '';

    this.canSubmitSolution.set(this.solutions.includes(code));
  }

  onLogButtonClick() {
    const codeEditor = this.challengesService.codeEditor();

    if (!codeEditor) {
      return;
    }

    this.logs.set([]);
    this._activeTerminalId.set(TERMINAL_TAB_IDS.console);
    this.isCodeExecuting.set(true);

    this._worker?.terminate();
    this._worker = new Worker(new URL('../../workers/quickjs-executor.worker', import.meta.url));

    this._worker.onmessage = ({ data }: WorkerOnMessage) => {
      if (data.type === LOG_TYPE.done) {
        this.isCodeExecuting.set(false);
        if (this._codeExecutingTimeoutId) {
          clearTimeout(this._codeExecutingTimeoutId);
          this._codeExecutingTimeoutId = null;
        }
        return;
      }

      if (data.mode === WORKER_MODE.log) {
        const { type, value } = data;

        this.logs.update((state) => [...state, { type, value }]);
      }
    };

    this._worker.postMessage({
      mode: WORKER_MODE.log,
      code: codeEditor.starterCode,
      builtinFns: codeEditor.builtinFns ?? {},
    });

    this._codeExecutingTimeoutId = setTimeout(() => {
      this._worker?.terminate();
      this._worker = null;
      this.logs.set([
        { type: LOG_TYPE.error, value: stringifyLog('Error: Time Limit Exceeded (3000ms)') },
      ]);
      this.isCodeExecuting.set(false);
      this._codeExecutingTimeoutId = null;
    }, 3000);
  }

  onTestButtonClick() {
    const codeEditor = this.challengesService.codeEditor();

    if (!codeEditor) {
      return;
    }

    this.tests.set([]);
    this._activeTerminalId.set(TERMINAL_TAB_IDS.tests);
    this.isCodeExecuting.set(true);

    this._worker?.terminate();
    this._worker = new Worker(new URL('../../workers/quickjs-executor.worker', import.meta.url));

    this._worker.onmessage = ({ data }: WorkerOnMessage) => {
      if (data.type === LOG_TYPE.done) {
        this.isCodeExecuting.set(false);
        if (this._codeExecutingTimeoutId) {
          clearTimeout(this._codeExecutingTimeoutId);
          this._codeExecutingTimeoutId = null;
        }
        return;
      }

      if (data.mode === WORKER_MODE.test) {
        if (this.isTestConsoleLine(data)) {
          const { type, value } = data;
          this.tests.update((state) => [...state, { kind: 'console', type, value }]);
          return;
        }

        const { type, description, expected, actual, passed } = data;

        this.tests.update((state) => [
          ...state,
          { kind: 'assert', type, description, expected, actual, passed },
        ]);
      }

      const codeEditor = this.challengesService.codeEditor();
      const tests = this.tests();

      if (
        codeEditor &&
        Array.isArray(codeEditor.testCases) &&
        codeEditor.testCases.length > 0 &&
        codeEditor.testCases.length === tests.length &&
        tests.every((test) => test.kind === 'assert' && test.passed)
      ) {
        this.solutions.push(codeEditor.starterCode.replace(/\s/g, ''));
        this.onCodeChange();
      }
    };

    this._worker.postMessage({
      mode: WORKER_MODE.test,
      functionName: codeEditor.functionName,
      code: codeEditor.starterCode,
      testCases: codeEditor.testCases,
      builtinFns: codeEditor.builtinFns ?? {},
    });

    this._codeExecutingTimeoutId = setTimeout(() => {
      this._worker?.terminate();
      this._worker = null;
      this.tests.set([
        {
          kind: 'assert',
          type: LOG_TYPE.error,
          description: stringifyLog('Error: Time Limit Exceeded (3000ms)'),
          expected: '-',
          actual: '-',
          passed: false,
        },
      ]);
      this.isCodeExecuting.set(false);
      this._codeExecutingTimeoutId = null;
    }, 3000);
  }

  onSubmitButtonClick() {
    this.challengesService.postTopicStatus(this.categoryId(), this.topicId(), 'completed');
  }

  private isTestConsoleLine(data: TestCase | TestConsoleLine): data is TestConsoleLine {
    return 'value' in data && !('passed' in data);
  }

  private _applyMonacoTheme() {
    const monaco = this._getMonacoInstance();
    if (!monaco) {
      return;
    }

    const currentTheme = this.themeService.theme();
    const secondaryColor = this._normalizeMonacoColor(
      getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim(),
    );

    monaco.editor.defineTheme(MONACO_RS_THEME, {
      base: currentTheme === 'dark' ? 'vs' : 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': secondaryColor,
        'editorGutter.background': secondaryColor,
        'minimap.background': secondaryColor,
      },
    });

    monaco.editor.setTheme(MONACO_RS_THEME);
  }

  private _normalizeMonacoColor(color: string): string {
    if (MONACO_LONG_HEX_COLOR_PATTERN.test(color)) {
      return color;
    }

    const shortHexMatch = MONACO_SHORT_HEX_COLOR_PATTERN.exec(color);
    const shortHexValue = shortHexMatch?.[1];

    if (shortHexValue) {
      return `#${shortHexValue
        .split('')
        .map((char) => `${char}${char}`)
        .join('')}`;
    }

    return MONACO_FALLBACK_BACKGROUND;
  }

  private _getMonacoInstance(): MonacoInstance | null {
    const monaco = (window as Window & { monaco?: MonacoInstance }).monaco;

    return monaco ?? null;
  }
}
