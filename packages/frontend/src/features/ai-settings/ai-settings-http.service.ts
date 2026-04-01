import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AiProviderDto, AiSettingsDto, UpdateAiSettingsDto } from '@rs-tandem/shared';

@Injectable({
  providedIn: 'root',
})
export class AiSettingsHttpService {
  private http = inject(HttpClient);

  getMySettings() {
    return this.http.get<AiSettingsDto>(`${environment.apiUrl}/ai/settings/me`);
  }

  updateMySettings(settings: UpdateAiSettingsDto) {
    return this.http.put<UpdateAiSettingsDto>(`${environment.apiUrl}/ai/settings/me`, settings);
  }

  getProviders() {
    return this.http.get<AiProviderDto[]>(`${environment.apiUrl}/ai/providers`);
  }
}
