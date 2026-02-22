import { Injectable } from '@angular/core';
import { Ollama } from 'ollama';
import { IErrorResponse, IMessage } from '../models/llm-message-model';
import { isAsyncIterable } from '@/core/guards/is-async-iterable';

const errorResponse: IErrorResponse = {
  error: true,
  message: 'Failed to get model response',
};

@Injectable({
  providedIn: 'root',
})
export class LocalLlmApi {
  private ollama = new Ollama();

  async sendPrompt(messages: IMessage[]) {
    try {
      const response = await this.ollama.chat({
        model: 'gemma3:4b',
        messages,
        stream: true,
      });
      if (isAsyncIterable(response)) return response;
      return errorResponse;
    } catch {
      return errorResponse;
    }
  }
}
