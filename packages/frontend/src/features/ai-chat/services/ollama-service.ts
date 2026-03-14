import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '@/environments/environment';
import { IErrorResponse, IMessage } from '../models/llm-message-model';

const errorResponse: IErrorResponse = {
  error: true,
  message: 'Failed to get model response',
};

type OllamaModel = 'gemma3:1b' | 'gemma3:4b';

interface AiChatResponseDto {
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class OllamaService {
  private readonly http = inject(HttpClient);

  async sendPrompt(messages: IMessage[], _model: OllamaModel): Promise<string | IErrorResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<AiChatResponseDto>(`${environment.apiUrl}/ai/chat`, { messages }),
      );
      return response.content;
    } catch (error) {
      console.error(error);
      return errorResponse;
    }
  }
}
