/// <reference lib="webworker" />

import {
  newQuickJSWASMModule,
  newVariant,
  RELEASE_SYNC,
  shouldInterruptAfterDeadline,
  type QuickJSHandle,
} from 'quickjs-emscripten';

import {
  LOG_TYPE,
  WORKER_MODE,
  type WorkerPostMessage,
} from '../pages/code-editor-page/code-edit-page.types';
import {
  accumulateParameters,
  stringifyLog,
} from '../pages/code-editor-page/code-editor-page.utilities';

type QuickJsWorkerRequest = WorkerPostMessage['data'];

const normalizeBuiltinFns = (input: unknown): Record<string, string> => {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }
  const out: Record<string, string> = {};
  for (const [name, source] of Object.entries(input)) {
    if (typeof name !== 'string' || name.length === 0) continue;
    if (typeof source !== 'string' || source.trim() === '') continue;
    out[name] = source;
  }
  return out;
};

const buildBuiltinBootstrapScript = (builtinFns: Record<string, string>): string => {
  const lines = ['"use strict";', 'globalThis.__builtinFns = Object.create(null);'];
  for (const [name, source] of Object.entries(builtinFns)) {
    lines.push(`globalThis.__builtinFns[${JSON.stringify(name)}] = (${source});`);
  }
  return lines.join('\n');
};

const isFunctionReference = (value: unknown): value is { $fn: string } => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  if (!('$fn' in value)) return false;
  const functionId = value.$fn;
  return typeof functionId === 'string' && functionId.length > 0;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const deepEqual = (a: unknown, b: unknown, seen = new WeakMap<object, object>()): boolean => {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object') return Object.is(a, b);

  if (!isRecord(a) || !isRecord(b)) return false;

  if (seen.get(a) === b) return true;
  seen.set(a, b);

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], seen)) return false;
    }
    return true;
  }

  if (Array.isArray(b)) return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key], seen)) return false;
  }

  return true;
};

let quickJsModulePromise: ReturnType<typeof newQuickJSWASMModule> | null = null;

const getQuickJSModule = async () => {
  if (quickJsModulePromise) {
    return quickJsModulePromise;
  }

  const baseUrl = self.location.href.includes('/rs-tandem/') ? '/rs-tandem' : '';
  const quickJsWasmUrl = `${baseUrl}/assets/quickjs/emscripten-module.wasm`;

  const quickJsVariant = newVariant(RELEASE_SYNC, {
    wasmLocation: quickJsWasmUrl,
  });

  quickJsModulePromise = newQuickJSWASMModule(quickJsVariant);
  return quickJsModulePromise;
};

const readErrorMessage = (dumped: unknown): string => {
  if (!isRecord(dumped)) return '';
  const message = dumped.message;
  if (typeof message === 'string') return message;
  const toString = dumped.toString;
  if (typeof toString === 'function') {
    try {
      const asText: unknown = toString.call(dumped);
      return typeof asText === 'string' ? asText : String(asText);
    } catch {
      return '';
    }
  }
  return '';
};

addEventListener('message', (event: MessageEvent<QuickJsWorkerRequest>) => {
  void runQuickJs(event.data);
});

async function runQuickJs(data: QuickJsWorkerRequest): Promise<void> {
  const { mode } = data;
  const builtinFns = normalizeBuiltinFns('builtinFns' in data ? data.builtinFns : undefined);

  const postDone = (summary?: { passed: number; failed: number; total: number }) => {
    postMessage({ mode, type: LOG_TYPE.done, summary });
  };

  const postLog = (
    type: typeof LOG_TYPE.log | typeof LOG_TYPE.warn | typeof LOG_TYPE.error,
    value: unknown,
  ) => {
    postMessage({ mode, type, value: stringifyLog(value) });
  };

  const postTestFatal = (description: string, actual: unknown) => {
    postMessage({
      mode: WORKER_MODE.test,
      type: LOG_TYPE.error,
      description,
      expected: '-',
      actual: stringifyLog(actual),
      passed: false,
    });
  };

  try {
    const QuickJS = await getQuickJSModule();
    const vm = QuickJS.newContext();

    vm.runtime.setInterruptHandler(shouldInterruptAfterDeadline(Date.now() + 2800));

    const trackedHandles: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(handle: T): T => {
      trackedHandles.push(handle);
      return handle;
    };

    const installHostConsole = (): boolean => {
      const logBridge = track(
        vm.newFunction('__rsTandemHostLog', (...handles: QuickJSHandle[]) => {
          const values: unknown[] = handles.map((handle) => vm.dump(handle) as unknown);
          postMessage({ mode, type: LOG_TYPE.log, value: accumulateParameters(values) });
        }),
      );
      const warnBridge = track(
        vm.newFunction('__rsTandemHostWarn', (...handles: QuickJSHandle[]) => {
          const values: unknown[] = handles.map((handle) => vm.dump(handle) as unknown);
          postMessage({ mode, type: LOG_TYPE.warn, value: accumulateParameters(values) });
        }),
      );
      const errorBridge = track(
        vm.newFunction('__rsTandemHostError', (...handles: QuickJSHandle[]) => {
          const values: unknown[] = handles.map((handle) => vm.dump(handle) as unknown);
          postMessage({ mode, type: LOG_TYPE.error, value: accumulateParameters(values) });
        }),
      );

      vm.setProp(vm.global, '__rsTandemHostLog', logBridge);
      vm.setProp(vm.global, '__rsTandemHostWarn', warnBridge);
      vm.setProp(vm.global, '__rsTandemHostError', errorBridge);

      const installResult = vm.evalCode(
        `(() => {
  'use strict';
  const hostLog = globalThis.__rsTandemHostLog;
  const hostWarn = globalThis.__rsTandemHostWarn;
  const hostError = globalThis.__rsTandemHostError;
  globalThis.console = {
    log: function () {
      return hostLog.apply(null, Array.prototype.slice.call(arguments));
    },
    warn: function () {
      return hostWarn.apply(null, Array.prototype.slice.call(arguments));
    },
    error: function () {
      return hostError.apply(null, Array.prototype.slice.call(arguments));
    },
  };
})();`,
        'install-console.js',
        { type: 'global' },
      );

      if (installResult.error) {
        const errorDump: unknown = vm.dump(installResult.error);
        installResult.error.dispose();
        postLog(LOG_TYPE.error, errorDump);
        return false;
      }
      installResult.value.dispose();
      return true;
    };

    const bootstrap = (): boolean => {
      if (!installHostConsole()) {
        return false;
      }

      const builtinsResult = vm.evalCode(buildBuiltinBootstrapScript(builtinFns), 'builtins.js', {
        type: 'global',
      });
      if (builtinsResult.error) {
        const errorDump: unknown = vm.dump(builtinsResult.error);
        builtinsResult.error.dispose();
        postLog(LOG_TYPE.error, errorDump);
        return false;
      }
      builtinsResult.value.dispose();
      return true;
    };

    const toVmHandle = (value: unknown): { handle: QuickJSHandle; owned: boolean } => {
      if (value === undefined) return { handle: vm.undefined, owned: false };
      if (value === null) return { handle: vm.null, owned: false };
      if (value === true) return { handle: vm.true, owned: false };
      if (value === false) return { handle: vm.false, owned: false };

      if (isFunctionReference(value)) {
        const builtinsHandle = vm.getProp(vm.global, '__builtinFns');
        try {
          const functionHandle = vm.getProp(builtinsHandle, value.$fn);
          return { handle: functionHandle, owned: true };
        } finally {
          builtinsHandle.dispose();
        }
      }

      if (typeof value === 'number') return { handle: vm.newNumber(value), owned: true };
      if (typeof value === 'string') return { handle: vm.newString(value), owned: true };
      if (typeof value === 'bigint')
        return { handle: vm.newString(`${value.toString()}n`), owned: true };
      if (typeof value === 'symbol') return { handle: vm.newString(value.toString()), owned: true };
      if (typeof value === 'function') return { handle: vm.newString('[Function]'), owned: true };

      if (Array.isArray(value)) {
        const arrayHandle = vm.newArray();
        for (let i = 0; i < value.length; i++) {
          const child = toVmHandle(value[i]);
          vm.setProp(arrayHandle, i, child.handle);
          if (child.owned) child.handle.dispose();
        }
        return { handle: arrayHandle, owned: true };
      }

      if (isRecord(value)) {
        const objectHandle = vm.newObject();
        for (const [key, entry] of Object.entries(value)) {
          const child = toVmHandle(entry);
          vm.setProp(objectHandle, key, child.handle);
          if (child.owned) child.handle.dispose();
        }
        return { handle: objectHandle, owned: true };
      }

      return { handle: vm.newString(stringifyLog(value)), owned: true };
    };

    if (!bootstrap()) {
      postDone();
      vm.dispose();
      return;
    }

    switch (mode) {
      case WORKER_MODE.log: {
        const result = vm.evalCode(`"use strict";\n${data.code}\n`, 'user.js', { type: 'global' });
        if (result.error) {
          const errorDump: unknown = vm.dump(result.error);
          result.error.dispose();
          postMessage({ mode, type: LOG_TYPE.error, value: stringifyLog(errorDump) });
          postDone();
        } else {
          result.value.dispose();
          postDone();
        }
        break;
      }

      case WORKER_MODE.test: {
        const { functionName, code, testCases } = data;

        const evalResult = vm.evalCode(`"use strict";\n${code}\n`, 'user.js', { type: 'global' });
        if (evalResult.error) {
          const errorDump: unknown = vm.dump(evalResult.error);
          evalResult.error.dispose();
          postTestFatal('Error: code execution failed', errorDump);
          postDone();
          break;
        }
        evalResult.value.dispose();

        const functionHandle = vm.getProp(vm.global, functionName);
        const typeOfFunction = vm.typeof(functionHandle);
        if (typeOfFunction !== 'function') {
          functionHandle.dispose();
          postTestFatal(`Error: Function "${functionName}" should be declared`, '');
          postDone();
          break;
        }

        let passedCount = 0;
        const total = testCases.length;

        for (const test of testCases) {
          const matcherKind = test.matcher?.kind ?? 'deepEqual';

          const ownedArguments: QuickJSHandle[] = [];
          const argumentHandles: QuickJSHandle[] = [];
          for (const argument of test.args) {
            const { handle, owned } = toVmHandle(argument);
            argumentHandles.push(handle);
            if (owned) ownedArguments.push(handle);
          }

          try {
            const callResult = vm.callFunction(functionHandle, vm.undefined, ...argumentHandles);

            if (matcherKind === 'throws') {
              const threw = Boolean(callResult.error);
              let ok = threw;

              let errorDump: unknown = null;
              if (callResult.error) {
                errorDump = vm.dump(callResult.error);
                callResult.error.dispose();
              } else {
                callResult.value.dispose();
              }

              if (threw && test.matcher?.errorName) {
                ok = ok && isRecord(errorDump) && errorDump.name === test.matcher.errorName;
              }
              if (threw && test.matcher?.messageIncludes) {
                const messageText = readErrorMessage(errorDump);
                ok = ok && messageText.includes(test.matcher.messageIncludes);
              }

              if (ok) passedCount++;
              postMessage({
                mode,
                type: ok ? LOG_TYPE.success : LOG_TYPE.error,
                description: test.description,
                expected: stringifyLog('[throws]'),
                actual: threw ? stringifyLog(errorDump) : stringifyLog('[did not throw]'),
                passed: ok,
              });
              continue;
            }

            if (callResult.error) {
              const errorDump: unknown = vm.dump(callResult.error);
              callResult.error.dispose();
              postMessage({
                mode,
                type: LOG_TYPE.error,
                description: test.description,
                expected: stringifyLog(test.expected),
                actual: stringifyLog(errorDump),
                passed: false,
              });
              continue;
            }

            const actual: unknown = vm.dump(callResult.value);
            callResult.value.dispose();

            const ok =
              matcherKind === 'toBe'
                ? Object.is(actual, test.expected)
                : deepEqual(actual, test.expected);

            if (ok) passedCount++;
            postMessage({
              mode,
              type: ok ? LOG_TYPE.success : LOG_TYPE.error,
              description: test.description,
              expected: stringifyLog(test.expected),
              actual: stringifyLog(actual),
              passed: ok,
            });
          } catch (error: unknown) {
            postMessage({
              mode,
              type: LOG_TYPE.error,
              description: test.description,
              expected: stringifyLog(test.expected),
              actual: stringifyLog(error),
              passed: false,
            });
          } finally {
            for (const ownedHandle of ownedArguments) {
              ownedHandle.dispose();
            }
          }
        }

        functionHandle.dispose();
        postDone({ passed: passedCount, failed: total - passedCount, total });
        break;
      }

      default:
        postDone();
    }

    for (const handle of trackedHandles) {
      handle.dispose();
    }
    vm.dispose();
  } catch (error) {
    postMessage({ mode, type: LOG_TYPE.error, value: stringifyLog(error) });
    postDone();
  }
}
