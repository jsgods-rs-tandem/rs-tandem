import { Injectable, signal, computed } from '@angular/core';
import { IMessage } from '../models/llm-message-model';
import { OllamaService } from './ollama-service';
import { ChatStatus } from '../models/ai-chat-status';

@Injectable({
  providedIn: 'root',
})
export class AiChatMockStore {
  private llm = new OllamaService();
  private _messages = signal<IMessage[]>([]);
  private _status = signal<ChatStatus>('default');

  readonly messages = this._messages.asReadonly();
  readonly messagesLength = computed(() => this._messages().length);
  readonly status = this._status.asReadonly();

  sendPrompt(text: string) {
    if (this.status() === 'default' || this.status() === 'error') {
      const message: IMessage = { role: 'user', content: text };
      this._messages.update((array) => [...array, message]);
      void this.send(message);
    }
  }

  updateStatus(status: ChatStatus) {
    this._status.set(status);
  }

  private async send(message: IMessage) {
    this.updateStatus('pending');
    const response = await this.llm.sendPrompt([message], 'gemma3:1b');

    if (typeof response === 'string') {
      const assistantMessage: IMessage = { role: 'assistant', content: response };
      this._messages.update((array) => [...array, assistantMessage]);
      this.updateStatus('default');
    } else {
      this.updateStatus('error');
    }
  }
}
