import { ApplicationConfig, provideAppInitializer, isDevMode } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withComponentInputBinding,
  withHashLocation,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from '@/core/interceptors/auth.interceptor';
import { initializeAuth } from '@/core/initializers/auth.initializer';
import { initializeI18n } from '@/core/initializers/i18n.initializer';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { getInitialLang } from '@/core/utils/i18n.utils';
import { APP_LANGUAGES, AppLanguage } from '@/core/constants/i18n.constants';
import { onViewTransitionCreated } from '@/core/configs/view-transitions.config';
import { provideConsoleFilter } from '@/core/configs/console-filter.provider';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

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
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated,
      }),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(initializeAuth),
    provideAppInitializer(initializeI18n),
    provideTransloco({
      config: {
        availableLangs: APP_LANGUAGES as unknown as AppLanguage[],
        defaultLang: getInitialLang(),
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideMonacoEditor(),
  ],
};
