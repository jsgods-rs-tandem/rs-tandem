import { IErrorResponse } from '@/features/ai-chat/models/llm-message-model';

export const isErrorLlmResponse = (response: unknown): response is IErrorResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as IErrorResponse).error === 'boolean' &&
    'message' in response &&
    typeof (response as IErrorResponse).message === 'string'
  );
};
