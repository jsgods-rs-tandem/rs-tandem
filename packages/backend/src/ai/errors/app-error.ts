import { ErrorCode } from './errors';

export default class AppError extends Error {
  constructor(
    public override message: string,
    public code: ErrorCode,
    public status: number,
  ) {
    super(message);
  }
}
