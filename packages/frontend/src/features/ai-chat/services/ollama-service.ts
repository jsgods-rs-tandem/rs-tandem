import { Injectable } from '@angular/core';
import { ChatResponse, Ollama } from 'ollama';
import { IErrorResponse, IMessage } from '../models/llm-message-model';

const errorResponse: IErrorResponse = {
  error: true,
  message: 'Failed to get model response',
};

type OllamaModel = 'gemma3:1b' | 'gemma3:4b';

@Injectable({
  providedIn: 'root',
})
export class OllamaService {
  private ollama = new Ollama();

  async sendPrompt(
    messages: IMessage[],
    model: OllamaModel,
  ): Promise<AsyncIterable<ChatResponse> | IErrorResponse> {
    try {
      const response = await this.ollama.chat({
        model,
        messages,
        stream: true,
      });
      return response;
    } catch (error) {
      console.error(error);
      return errorResponse;
    }
  }
}
