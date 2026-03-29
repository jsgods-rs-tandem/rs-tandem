import { HttpErrorResponse } from '@angular/common/http';
import { isErrorWithMessage } from '@/core/guards/is-error-with-message';

function isErrorCode(key: string): boolean {
  return key.includes('.');
}

function extractRawMessages(error: HttpErrorResponse): string | string[] | null {
  if (!isErrorWithMessage(error.error)) {
    return null;
  }

  const { message } = error.error;

  if (typeof message === 'string') {
    return message;
  }

  if (message.length > 0) {
    return message;
  }

  return null;
}

export function getHttpErrorMessage(error: HttpErrorResponse, fallback: string): string | string[] {
  if (error.status === 0) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  if (error.status >= 500) {
    return 'Server error. Please try again later.';
  }

  const messages = extractRawMessages(error);

  if (!messages) {
    return fallback;
  }

  if (Array.isArray(messages)) {
    return messages;
  }

  if (isErrorCode(messages)) {
    return messages;
  }

  return messages;
}
