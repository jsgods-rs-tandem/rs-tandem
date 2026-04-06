import type { ChallengeTestCase } from '../../services/challenges.types';

const WORKER_MODE = {
  log: 'log',
  test: 'test',
} as const;

const LOG_TYPE = {
  log: 'log',
  warn: 'warn',
  success: 'success',
  error: 'error',
  done: 'done',
} as const;

type WorkerMode = (typeof WORKER_MODE)[keyof typeof WORKER_MODE];
type LogType = (typeof LOG_TYPE)[keyof typeof LOG_TYPE];

interface Log {
  mode: Extract<WorkerMode, 'log'>;
  type: Extract<LogType, 'log' | 'warn' | 'error'>;
  value: string;
}

interface TestCase {
  mode: Extract<WorkerMode, 'test'>;
  type: Extract<LogType, 'success' | 'error'>;
  description: string;
  expected: string;
  actual: string;
  passed: boolean;
}

/** Console output while running tests (e.g. `console.log` inside the solution function). */
interface TestConsoleLine {
  mode: Extract<WorkerMode, 'test'>;
  type: Extract<LogType, 'log' | 'warn' | 'error'>;
  value: string;
}

type TestTerminalRow =
  | {
      kind: 'assert';
      type: Extract<LogType, 'success' | 'error'>;
      description: string;
      expected: string;
      actual: string;
      passed: boolean;
    }
  | {
      kind: 'console';
      type: Extract<LogType, 'log' | 'warn' | 'error'>;
      value: string;
    };

interface DoneMessage {
  mode: WorkerMode;
  type: Extract<LogType, 'done'>;
  summary?: {
    passed: number;
    failed: number;
    total: number;
  };
}

interface WorkerOnMessage {
  data: Log | TestCase | TestConsoleLine | DoneMessage;
}

interface WorkerPostMessage {
  data:
    | {
        mode: Extract<WorkerMode, 'log'>;
        code: string;
        builtinFns?: Record<string, string>;
      }
    | {
        mode: Extract<WorkerMode, 'test'>;
        functionName: string;
        code: string;
        testCases: ChallengeTestCase[];
        builtinFns?: Record<string, string>;
      };
}

export {
  WORKER_MODE,
  LOG_TYPE,
  type WorkerMode,
  type Log,
  type TestCase,
  type TestConsoleLine,
  type TestTerminalRow,
  type DoneMessage,
  type WorkerOnMessage,
  type WorkerPostMessage,
};
