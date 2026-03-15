import { inject } from '@angular/core';
import { EMPTY, catchError, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthStore } from '../store/auth.store';

export function initializeAuth() {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);

  if (!authService.getToken()) {
    return;
  }

  return authService.getMe().pipe(
    tap((user) => {
      authStore.setUser(user);
    }),
    catchError(() => {
      authService.logout();
      return EMPTY;
    }),
  );
}
