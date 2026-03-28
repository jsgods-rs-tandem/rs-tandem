import { HttpErrorResponse } from '@angular/common/http';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { isErrorWithMessage } from '@/core/guards/is-error-with-message';
import type { AppTranslationKey } from '@/shared/types/translation-keys';

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

function mapMessage(raw: string, messageMap?: Record<string, AppTranslationKey>): string {
  return messageMap?.[raw] ?? raw;
}

export function getHttpErrorMessageTKey(
  error: HttpErrorResponse,
  fallback: AppTranslationKey,
  messageMap?: Record<string, AppTranslationKey>,
): AppTranslationKey | AppTranslationKey[] {
  if (error.status === 0) {
    return marker('errors.noConnection') as AppTranslationKey;
  }

  if (error.status >= 500) {
    return marker('errors.serverError') as AppTranslationKey;
  }

  const messages = extractRawMessages(error);

  if (!messages) {
    return fallback;
  }

  if (Array.isArray(messages)) {
    return messages.map((message) => mapMessage(message, messageMap)) as AppTranslationKey[];
  }

  return mapMessage(messages, messageMap) as AppTranslationKey;
}
