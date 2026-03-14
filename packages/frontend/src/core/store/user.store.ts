import { Injectable, signal } from '@angular/core';
import { UserDto } from '@rs-tandem/shared';

@Injectable({ providedIn: 'root' })
export class UserStore {
  readonly user = signal<UserDto | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  setUser(user: UserDto): void {
    this.user.set(user);
    this.isLoading.set(false);
    this.error.set(null);
  }

  clearUser(): void {
    this.user.set(null);
    this.error.set(null);
  }

  setLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  setError(error: string): void {
    this.error.set(error);
    this.isLoading.set(false);
  }
}
