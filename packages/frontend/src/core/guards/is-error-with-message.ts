interface ErrorBody {
  message: string | string[];
}

export function isErrorWithMessage(value: unknown): value is ErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    (typeof (value as ErrorBody).message === 'string' ||
      Array.isArray((value as ErrorBody).message))
  );
}
