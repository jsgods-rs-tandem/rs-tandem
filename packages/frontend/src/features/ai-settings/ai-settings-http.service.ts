import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AiSettingsDto } from '@rs-tandem/shared';

@Injectable({
  providedIn: 'root',
})
export class AiSettingsHttpService {
  private http = inject(HttpClient);

  getMySttings() {
    return this.http.get<AiSettingsDto>(`${environment.apiUrl}/ai/settings/me`);
  }

  updateMySettings(settings: AiSettingsDto) {
    return this.http.put<AiSettingsDto>(`${environment.apiUrl}/ai/settings/me`, settings);
  }
}
