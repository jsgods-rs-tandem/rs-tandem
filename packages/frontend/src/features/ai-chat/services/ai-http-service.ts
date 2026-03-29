import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AiMessage } from '@rs-tandem/shared';

@Injectable({
  providedIn: 'root',
})
export class AiHttpService {
  private http = inject(HttpClient);

  getHistory() {
    return this.http.get<AiMessage[]>(`${environment.apiUrl}/chat-history/history`);
  }

  deleteHistory() {
    return this.http.delete<never>(`${environment.apiUrl}/chat-history/history`);
  }
}
