import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { UpdateProfileDto, UserProfileDto } from '@rs-tandem/shared';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfilesService {
  private http = inject(HttpClient);

  getProfile(id: string): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${environment.apiUrl}/profiles/${id}`);
  }

  updateProfile(data: UpdateProfileDto): Observable<UserProfileDto> {
    return this.http.patch<UserProfileDto>(`${environment.apiUrl}/profiles/me`, data);
  }
}
