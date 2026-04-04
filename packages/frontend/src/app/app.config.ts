import { ApplicationConfig, provideAppInitializer } from '@angular/core';
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
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

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
    provideMonacoEditor(),
  ],
};
