import { Injectable, signal, computed } from '@angular/core';
import { IMessage, IStreamMessage } from '../models/llm-message-model';
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
  private _messages = signal<(IMessage | IStreamMessage)[]>([...this._history()]);

  readonly messages = this._messages.asReadonly();
  readonly messagesLength = computed(() => this._messages().length);

  sendPrompt(text: string) {
    const message: IMessage = { role: 'user', content: text };
    this._history.update((array) => [...array, message]);
    this._messages.update((array) => [...array, message]);
    void this.send();
  }

  private async send() {
    const response = await this.llm.sendPrompt(this._history(), 'gemma3:1b');

    if (isAsyncIterable(response)) {
      const message: IStreamMessage = { role: 'assistant', content: response };

      this._messages.update((array) => [...array, message]);
    }
  }

  reset() {
    this._history.set([]);
  }
}
