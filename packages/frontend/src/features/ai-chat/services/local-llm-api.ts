import { Injectable } from '@angular/core';
import { Ollama } from 'ollama';
import { IErrorResponse, IMessage } from '../models/llm-message-model';
import { isAsyncIterable } from '@/core/guards/is-async-iterable';

const errorResponse: IErrorResponse = {
  error: true,
  message: 'Failed to get model response',
};

type OllamaModel = 'gemma3:1b' | 'gemma3:4b';

@Injectable({
  providedIn: 'root',
})
abstract class LlmProvider {
  abstract sendPrompt(
    messages: IMessage[],
    model: string,
  ): Promise<AsyncIterable<unknown> | IErrorResponse>;
}

export class LocalLlmApi implements LlmProvider {
  private ollama = new Ollama();

  async sendPrompt(messages: IMessage[], model: OllamaModel) {
    try {
      const response = await this.ollama.chat({
        model,
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
