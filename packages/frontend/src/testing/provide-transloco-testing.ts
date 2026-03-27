import { TranslocoTestingModule } from '@jsverse/transloco';

/**
 * Provides a standardized Transloco testing module for use in unit tests.
 * This ensures that components using translations can be tested without
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
        availableLangs: ['en', 'ru'],
        defaultLang: 'en',
      },
      preloadLangs: true,
    }).providers ?? []
  );
}
