import AppError from '../../common/utils/app-error';

export default class OllamaError extends AppError {
  constructor(message: string, status: number) {
    super(message, 'OLLAMA_ERROR', status);
  }
}
