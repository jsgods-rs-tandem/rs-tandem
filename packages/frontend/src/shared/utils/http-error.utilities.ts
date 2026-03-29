import { HttpErrorResponse } from '@angular/common/http';
import { isErrorWithMessage } from '@/core/guards/is-error-with-message';
import { isAppTranslationKey, type AppTranslationKey } from '@/shared/types/translation-keys';

function extractRawMessages(
  error: HttpErrorResponse,
): AppTranslationKey | AppTranslationKey[] | null {
  if (!isErrorWithMessage(error.error)) {
    return null;
  }

  const { message } = error.error;

  if (typeof message === 'string') {
    return isAppTranslationKey(message) ? message : null;
  }

  const validKeys = message.filter((message_): message_ is AppTranslationKey =>
    isAppTranslationKey(message_),
  );

  if (validKeys.length > 0) {
    return validKeys;
  }

  return null;
}

export function getHttpErrorMessage(
  error: HttpErrorResponse,
  fallback: AppTranslationKey = 'errors.common.unexpected',
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
    return messages;
  }

  return fallback;
}
