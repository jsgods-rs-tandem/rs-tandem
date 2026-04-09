import AiAppError from './app-error';

export default class OllamaError extends AiAppError {
  constructor(message: string, status: number) {
    super(message, 'OLLAMA_ERROR', status);
  }
}
