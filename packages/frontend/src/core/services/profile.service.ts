import { HttpClient } from '@angular/common/http';
import { AuthStore } from '../store/auth.store';
import { inject, Injectable } from '@angular/core';
import { UpdateProfileDto, UserProfileDto } from '@rs-tandem/shared';
import { Observable, tap } from 'rxjs';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfilesService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);

  getProfile(id: string): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${environment.apiUrl}/profiles/${id}`);
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
}
