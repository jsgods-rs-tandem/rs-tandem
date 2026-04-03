export default class AppError extends Error {
  constructor(
    public override message: string,
    public code: string,
    public status: number,
  ) {
    super(message);
  }
}
