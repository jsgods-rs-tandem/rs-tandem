import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { ROUTE_PATHS } from '../constants';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const modalService = inject(ModalService);
  const token = authService.getToken();

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (authService.isAuthenticated() && !router.url.includes('auth')) {
          authService.logout();

          modalService.open({
            title: 'Session Expired',
            message: 'Your session has expired. Please log in again.',
            icon: 'logout',
            onClose: () => {
              void router.navigate([ROUTE_PATHS.signUp]);
            },
          });
        } else {
          // Silent logout for initial load or non-authenticated state
          authService.logout();
        }
      }

      return throwError(() => error);
    }),
  );
};
