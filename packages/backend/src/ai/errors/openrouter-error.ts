import AppError from '../../common/utils/app-error';

export default class OpenRouterError extends AppError {
  constructor(message: string, status: number) {
    super(message, 'OPENROUTER_ERROR', status);
  }
}
