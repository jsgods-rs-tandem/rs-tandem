import { ApplicationConfig, provideAppInitializer, isDevMode } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from '@/core/interceptors/auth.interceptor';
import { initializeAuth } from '@/core/initializers/auth.initializer';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withComponentInputBinding(),
      withHashLocation(),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(initializeAuth),
    provideTransloco({
      config: {
        availableLangs: ['en', 'ru'],
        defaultLang: navigator.language.startsWith('ru') ? 'ru' : 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
