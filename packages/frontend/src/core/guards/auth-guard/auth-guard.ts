import { inject } from '@angular/core';
import { RedirectCommand, Router, type CanActivateFn } from '@angular/router';

import { AuthService } from '@/core/services/auth.service';

import { ROUTES, ROUTE_PATHS } from '@/core/constants';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuthenticated();

  const { routeConfig } = route;

  if (!routeConfig) {
    return false;
  }

  const { path } = routeConfig;

  if (ROUTES.home === path || ROUTES.signIn === path || ROUTES.signUp === path) {
    if (isAuthenticated) {
      // While developing redirect in library. In future - profile?
      const libraryPath = router.parseUrl(ROUTE_PATHS.library);

      return new RedirectCommand(libraryPath);
    }

    return true;
  }

  return isAuthenticated;
};
