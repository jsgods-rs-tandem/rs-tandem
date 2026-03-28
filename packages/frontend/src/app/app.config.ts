import { ApplicationConfig, provideAppInitializer, isDevMode } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withComponentInputBinding,
  withHashLocation,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from '@/core/interceptors/auth.interceptor';
import { initializeAuth } from '@/core/initializers/auth.initializer';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { getInitialLang } from '@/core/utils/i18n.utils';
import { APP_LANGUAGES, AppLanguage } from '@/core/constants/i18n.constants';
import { onViewTransitionCreated } from '@/core/configs/view-transitions.config';
import { provideConsoleFilter } from '@/core/configs/console-filter.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideConsoleFilter(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withComponentInputBinding(),
      withHashLocation(),
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated,
      }),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(initializeAuth),
    provideTransloco({
      config: {
        availableLangs: APP_LANGUAGES as unknown as AppLanguage[],
        defaultLang: getInitialLang(),
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
