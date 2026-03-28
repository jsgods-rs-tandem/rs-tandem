import { marker } from '@jsverse/transloco-keys-manager/marker';
import type { AppTranslationKey } from '@/shared/types/translation-keys';

export const AUTH_ERROR_MESSAGES: Record<string, AppTranslationKey> = {
  'Invalid credentials': marker('auth.errorMessages.invalidCredentials') as AppTranslationKey,
  'Email already registered': marker(
    'auth.errorMessages.emailAlreadyRegistered',
  ) as AppTranslationKey,
  'email must be an email': marker('auth.errorMessages.invalidEmail') as AppTranslationKey,
  'password must be longer than or equal to 8 characters': marker(
    'auth.errorMessages.passwordTooShort',
  ) as AppTranslationKey,
  'displayName must be shorter than or equal to 50 characters': marker(
    'auth.errorMessages.displayNameTooLong',
  ) as AppTranslationKey,
};
