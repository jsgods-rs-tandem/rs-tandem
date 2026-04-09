import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { AlertComponent } from '@/shared/ui';
import { FormattedTextContentComponent } from '../formatted-text-content';
import { AnswerTileComponent, CodeSnippetComponent } from './components';

import type { AnswerTileGroupItem } from './answer-tile-group.types';

@Component({
  selector: 'app-answer-tile-group',
  imports: [
    AlertComponent,
    AnswerTileComponent,
    CodeSnippetComponent,
    FormattedTextContentComponent,
  ],
  templateUrl: './answer-tile-group.component.html',
  styleUrl: './answer-tile-group.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AnswerTileGroupComponent),
      multi: true,
    },
  ],
  standalone: true,
})
export class AnswerTileGroupComponent implements ControlValueAccessor {
  checkedId = '';
  disabled = false;

  readonly id = input.required<string>();

  readonly question = input.required<string>();
  readonly codeSnippet = input<string | null>(null);
  readonly answers = input.required<AnswerTileGroupItem[]>();

  readonly answerResult = input.required<ReturnType<AnswerTileComponent['status']>>();
  readonly answerComment = input<string>();

  writeValue(value: string | null) {
    this.checkedId = value ?? '';
  }

  registerOnChange(callback: (value: string) => void) {
    this._onChange = callback;
  }

  registerOnTouched(callback: () => void) {
    this._onTouched = callback;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  onInput(value: string) {
    this.checkedId = value;

    this._onChange(value);
    this._onTouched();
  }

  private _onChange: (_: string) => void = () => void 0;

  private _onTouched: () => void = () => void 0;
}
