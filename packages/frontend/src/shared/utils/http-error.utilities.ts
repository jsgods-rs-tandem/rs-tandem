import { HttpErrorResponse } from '@angular/common/http';
import { isErrorWithMessage } from '@/core/guards/is-error-with-message';
import type { AppTranslationKey } from '@/shared/types/translation-keys';

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

export function getHttpErrorMessage(
  error: HttpErrorResponse,
  fallback: AppTranslationKey,
): AppTranslationKey | AppTranslationKey[] {
  if (error.status === 0) {
    return 'errors.network.connection';
  }

  if (error.status >= 500) {
    return 'errors.network.server';
  }

  const messages = extractRawMessages(error);

  if (!messages) {
    return fallback;
  }

  if (Array.isArray(messages)) {
    return messages.map((message) => (isErrorCode(message) ? message : fallback));
  }

  if (isErrorCode(messages)) {
    return messages;
  }

  return fallback;
}
