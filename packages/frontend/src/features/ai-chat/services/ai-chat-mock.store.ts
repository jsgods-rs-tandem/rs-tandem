import { Injectable, signal, computed } from '@angular/core';
import { IMessage, IStreamMessage } from '../models/llm-message-model';
import { OllamaService } from './ollama-service';
import { isAsyncIterable } from '@/core/guards/is-async-iterable';

@Injectable({
  providedIn: 'root',
})
export class AiChatMockStore {
  private llm = new OllamaService();
  private _messages = signal<(IMessage | IStreamMessage)[]>([]);

  readonly messages = this._messages.asReadonly();
  readonly messagesLength = computed(() => this._messages().length);

  sendPrompt(text: string) {
    const message: IMessage = { role: 'user', content: text };
    this._messages.update((array) => [...array, message]);
    void this.send(message);
  }

  private async send(message: IMessage) {
    const response = await this.llm.sendPrompt([message], 'gemma3:1b');

    if (isAsyncIterable(response)) {
      const message: IStreamMessage = { role: 'assistant', content: response };

      this._messages.update((array) => [...array, message]);
    }
  }
}
