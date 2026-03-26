import type { AuthUser } from '@/shared/types';
import { Injectable, computed, signal } from '@angular/core';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

const createInitialState = (): AuthState => ({
  user: null,
  isLoading: false,
  error: null,
});

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _state = signal<AuthState>(createInitialState());

  readonly user = computed<AuthUser | null>(() => {
    const user = this._state().user;

    return user ? { ...user } : null;
  });

  readonly name = computed(() => this._state().user?.displayName ?? null);
  readonly email = computed(() => this._state().user?.email ?? null);

  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);

  setUser(user: AuthUser): void {
    this._state.set({ user, isLoading: false, error: null });
  }

  updateUser(updatedFields: Partial<AuthUser>): void {
    this._state.update((state) => ({
      ...state,
      user: state.user ? { ...state.user, ...updatedFields } : null,
    }));
  }

  clearUser(): void {
    this._state.set(createInitialState());
  }

  setLoading(isLoading: boolean): void {
    this._state.update((state) => ({ ...state, isLoading }));
  }

  setError(error: string): void {
    this._state.update((state) => ({ ...state, isLoading: false, error }));
  }
}
