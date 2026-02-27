import { Injectable, signal, computed } from '@angular/core';
import { IMessage } from '../models/llm-message-model';
import { OllamaService } from './ollama-service';
import { isAsyncIterable } from '@/core/guards/is-async-iterable';

const mockHistory: IMessage[] = [
  { role: 'user', content: 'Hello!' },
  {
    role: 'assistant',
    content:
      'Hello there! How can I help you today? 😊 Do you have any questions for me, or would you like to chat about something?',
  },
];

@Injectable({
  providedIn: 'root',
})
export class AiChatMockStore {
  private llm = new OllamaService();
  private _history = signal<IMessage[]>([...mockHistory]);

  readonly history = this._history.asReadonly();
  readonly historyLength = computed(() => this._history().length);

  sendPrompt(text: string) {
    const message: IMessage = { role: 'user', content: text };
    this._history.update((array) => [...array, message]);
    void this.send();
  }

  private async send() {
    const response = await this.llm.sendPrompt(this._history(), 'gemma3:1b');
    try {
      if (isAsyncIterable(response)) {
        const message: IMessage = { role: 'assistant', content: '' };

        for await (const part of response) {
          message.content += part.message.content;
        }

        this._history.update((array) => [...array, message]);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  reset() {
    this._history.set([]);
  }
}
