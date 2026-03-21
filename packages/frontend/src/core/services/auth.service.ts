import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  UserDto,
  UpdateProfileDto,
  UserProfileDto,
} from '@rs-tandem/shared';
import { LocalStorageService } from './local-storage.service';
import { environment } from '@/environments/environment';
import { AuthStore } from '../store/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private authStore = inject(AuthStore);

  private readonly TOKEN_KEY = 'auth_token';

  register(dto: RegisterDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${environment.apiUrl}/auth/register`, dto);
  }

  login(dto: LoginDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${environment.apiUrl}/auth/login`, dto).pipe(
      tap((response) => {
        if (response.accessToken) {
          this.localStorageService.setItem(this.TOKEN_KEY, response.accessToken);
        }
      }),
    );
  }

  clearAuthData(): void {
    this.localStorageService.removeItem(this.TOKEN_KEY);
    this.authStore.clearUser();
  }

  logout(): void {
    this.clearAuthData();
  }

  getToken(): string | null {
    return this.localStorageService.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.authStore.user();
  }

  getMe(): Observable<UserDto> {
    return this.http.get<UserDto>(`${environment.apiUrl}/auth/me`);
  }

  updateProfile(data: UpdateProfileDto): Observable<UserProfileDto> {
    return this.http.patch<UserProfileDto>(`${environment.apiUrl}/profiles/me`, data).pipe(
      tap((updatedProfile) => {
        const updatedFields: UpdateProfileDto = {
          displayName: updatedProfile.displayName,
          email: updatedProfile.email,
          avatarUrl: updatedProfile.avatarUrl,
          githubUsername: updatedProfile.githubUsername,
        };
        this.authStore.updateUser(updatedFields);
      }),
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<unknown> {
    return this.http.patch<unknown>(`${environment.apiUrl}/auth/change-password`, {
      currentPassword,
      newPassword,
    });
  }
}
