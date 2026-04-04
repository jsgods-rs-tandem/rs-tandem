export const stringifyLog = (log: unknown): string => {
  if (log instanceof Error) {
    return `[${log.name}] ${log.message}`;
  }

  return typeof log === 'object' && log !== null ? JSON.stringify(log) : String(log);
};

export const accumulateParameters = (parameters: unknown[]) =>
  parameters
    .reduce<string>((accumulator, current) => `${accumulator} ${stringifyLog(current)}`, '')
    .trim();
