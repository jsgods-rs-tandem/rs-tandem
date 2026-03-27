import type { TranslationKey } from '@/shared/types/i18n.generated';

export const AUTH_ERROR_MESSAGES: Record<string, TranslationKey> = {
  'Invalid credentials': 'auth.errorMessages.invalidCredentials',
  'Email already registered': 'auth.errorMessages.emailAlreadyRegistered',
  'email must be an email': 'auth.errorMessages.invalidEmail',
  'password must be longer than or equal to 8 characters': 'auth.errorMessages.passwordTooShort',
  'displayName must be shorter than or equal to 50 characters':
    'auth.errorMessages.displayNameTooLong',
};
