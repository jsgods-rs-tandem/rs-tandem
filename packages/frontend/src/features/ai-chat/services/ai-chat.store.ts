import { Injectable, signal, computed, inject, NgZone } from '@angular/core';
import { IMessage } from '../models/llm-message-model';
import { ChatStatus } from '../models/ai-chat-status';
import { AiSocketService } from './ai-socket-service';
import { Subscription } from 'rxjs';
import { AiChatResponseDto } from '@rs-tandem/shared';

@Injectable({
  providedIn: 'root',
})
export class AiChatStore {
  private _messages = signal<IMessage[]>([]);
  private _status = signal<ChatStatus>('connecting');
  private service = inject(AiSocketService);
  private socketSubscriptions: Subscription[] = [];
  private zone = inject(NgZone);

  readonly messages = this._messages.asReadonly();
  readonly messagesLength = computed(() => this._messages().length);
  readonly status = this._status.asReadonly();

  sendPrompt(text: string) {
    if (this.status() === 'default' || this.status() === 'error') {
      const message: IMessage = { role: 'user', content: text };
      this._messages.update((array) => [...array, message]);
      this._status.set('pending');
      this.service.emit('chat', message);
    }
  }

  updateStatus(status: ChatStatus) {
    this._status.set(status);
  }

  initSocketListeners() {
    this.subscribeToEvent('chat_chunk', this.handleNewChunk);
    this.subscribeToEvent('chat_end', this.handleChatEnd);
    this.subscribeToEvent('connect', this.handleConnect);
    this.subscribeToEvent('disconnect', this.handleDisconnect);
    this.subscribeToEvent('connect_error', this.handleConnectionError);
  }

  destroySocketListeners() {
    this.socketSubscriptions.forEach((listener) => {
      listener.unsubscribe();
    });
    this.socketSubscriptions = [];
    this.service.disconnect();
  }

  private subscribeToEvent(event: string, handler: (data: unknown) => void) {
    const sub = this.service.listen(event).subscribe(handler);
    this.socketSubscriptions.push(sub);
  }

  private handleChatEnd = () => {
    this.updateStatus('default');
    this._messages.update((array) => {
      const last = array[array.length - 1];
      if (last?.role === 'assistant') {
        const message = {
          role: last.role,
          content: `${last.content}\n`,
        };
        return [...array.slice(0, -1), message];
      }
      return array;
    });
  };

  private handleNewChunk = (response: unknown) => {
    const chunk = response as AiChatResponseDto;
    if (this.status() !== 'typing') this.updateStatus('typing');
    this._messages.update((array) => {
      const last = array[array.length - 1];
      if (last?.role !== 'assistant') {
        const message: IMessage = {
          role: 'assistant',
          content: chunk,
        };
        return [...array, message];
      }
      const message = {
        role: last.role,
        content: `${last.content}${chunk}`,
      };
      return [...array.slice(0, -1), message];
    });
  };

  private handleConnect = () => {
    this.zone.run(() => {
      this.updateStatus('default');
    });
  };

  private handleDisconnect = () => {
    this.zone.run(() => {
      this.updateStatus('connecting');
    });
  };

  private handleConnectionError = () => {
    this.zone.run(() => {
      this.updateStatus('connecting');
    });
  };
}
