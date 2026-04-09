import AiAppError from './app-error';

export default class OpenRouterError extends AiAppError {
  constructor(message: string, status: number) {
    super(message, 'OPENROUTER_ERROR', status);
  }
}
