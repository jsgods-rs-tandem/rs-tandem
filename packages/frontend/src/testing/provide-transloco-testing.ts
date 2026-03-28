import { TranslocoTestingModule } from '@jsverse/transloco';
import { APP_LANGUAGES, DEFAULT_LANGUAGE, AppLanguage } from '@/core/constants/i18n.constants';

/**
 * Provides a standardized Transloco testing module for use in unit tests.
 * This helper centralizes the Transloco testing configuration to prevent
 * missing provider errors.
 */
export function provideAppTranslocoTesting() {
  return (
    TranslocoTestingModule.forRoot({
      langs: {
        en: {},
        ru: {},
      },
      translocoConfig: {
        availableLangs: APP_LANGUAGES as unknown as AppLanguage[],
        defaultLang: DEFAULT_LANGUAGE,
      },
      preloadLangs: true,
    }).providers ?? []
  );
}
