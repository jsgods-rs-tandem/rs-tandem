export const TERMINAL_TAB_IDS = {
  console: 'console',
  tests: 'tests',
} as const;

export type TerminalTabIds = (typeof TERMINAL_TAB_IDS)[keyof typeof TERMINAL_TAB_IDS];
