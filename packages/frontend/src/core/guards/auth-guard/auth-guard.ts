import { inject } from '@angular/core';
import { RedirectCommand, Router, type CanActivateFn } from '@angular/router';

import { AuthService } from '@/core/services/auth.service';

import { ROUTES, ROUTE_PATHS } from '@/core/constants';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const authService = inject(AuthService);

  const { routeConfig } = route;

  if (routeConfig === null) {
    return false;
  }

  const { path } = routeConfig;
  const isAuthenticated = authService.isAuthenticated();

  if (ROUTES.home === path || ROUTES.signIn === path || ROUTES.signUp === path) {
    if (isAuthenticated) {
      const libraryPath = router.parseUrl(ROUTE_PATHS.library);

      return new RedirectCommand(libraryPath);
    }

    return true;
  }

  const homePath = router.parseUrl(ROUTE_PATHS.home);

  return isAuthenticated ? true : new RedirectCommand(homePath);
};
