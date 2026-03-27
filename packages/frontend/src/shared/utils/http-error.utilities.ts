import { HttpErrorResponse } from '@angular/common/http';
import { isErrorWithMessage } from '@/core/guards/is-error-with-message';
import type { TranslationKey } from '@/shared/types/i18n.generated';

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

function mapMessage(raw: string, messageMap?: Record<string, TranslationKey>): string {
  return messageMap?.[raw] ?? raw;
}

export function getHttpErrorMessageTKey(
  error: HttpErrorResponse,
  fallback: TranslationKey,
  messageMap?: Record<string, TranslationKey>,
): TranslationKey | TranslationKey[] {
  if (error.status === 0) {
    return 'errors.noConnection';
  }

  if (error.status >= 500) {
    return 'errors.serverError';
  }

  const messages = extractRawMessages(error);

  if (!messages) {
    return fallback;
  }

  if (Array.isArray(messages)) {
    return messages.map((message) => mapMessage(message, messageMap)) as TranslationKey[];
  }

  return mapMessage(messages, messageMap) as TranslationKey;
}
