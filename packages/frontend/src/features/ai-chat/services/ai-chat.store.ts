import { Injectable, signal, computed, inject, NgZone } from '@angular/core';
import { IMessage } from '../models/llm-message-model';
import { ChatStatus } from '../models/ai-chat-status';
import { AiSocketService } from './ai-socket-service';
import { finalize, Subscription } from 'rxjs';
import { AiChatResponseDto, AiMessage } from '@rs-tandem/shared';
import { AiHttpService } from './ai-http-service';
import { AiError } from '@rs-tandem/shared/src/ai';

const unknownError: AiError = {
  type: 'unknown_error',
  title: 'Unknown',
  message: 'Server responsed with unknown error. Try again later',
  status: 500,
};

@Injectable({
  providedIn: 'root',
})
export class AiChatStore {
  private _messages = signal<IMessage[]>([]);
  private _status = signal<ChatStatus>('default');
  private wsApi = inject(AiSocketService);
  private httpApi = inject(AiHttpService);
  private socketSubscriptions: Subscription[] = [];
  private zone = inject(NgZone);

  readonly errorMessage = signal<AiError>(unknownError);
  readonly messages = this._messages.asReadonly();
  readonly messagesLength = computed(() => this._messages().length);
  readonly status = this._status.asReadonly();
  readonly isReady = signal({
    socket: false,
    history: false,
  });

  sendPrompt(text: string) {
    if (this.status() === 'default' || this.status() === 'error') {
      const message: IMessage = { role: 'user', content: text };
      this._messages.update((array) => [...array, message]);
      this._status.set('pending');
      if (this.isReady().socket) {
        this.wsApi.emit('chat', message);
      } else {
        const errorMessage = {
          type: 'server_error',
          title: 'Server',
          message: 'no connection to socket',
          status: 503,
        };
        console.error(errorMessage);
        this.handleError(errorMessage);
      }
    }
  }

  updateStatus(status: ChatStatus) {
    this._status.set(status);
  }

  initSocketListeners() {
    this.wsApi.connect();
    this.subscribeToEvent('chat_chunk', this.handleNewChunk);
    this.subscribeToEvent('chat_end', this.handleChatEnd);
    this.subscribeToEvent('connect', this.handleConnect);
    this.subscribeToEvent('disconnect', this.handleDisconnect);
    this.subscribeToEvent('connect_error', this.handleConnectionError);
    this.subscribeToEvent('exception', this.handleUnknownError);
    this.subscribeToEvent('error', this.handleError);
  }

  destroySocketListeners() {
    this.socketSubscriptions.forEach((listener) => {
      listener.unsubscribe();
    });
    this.socketSubscriptions = [];
    this.wsApi.disconnect();
  }

  clearHistory() {
    this.httpApi.deleteHistory().subscribe({
      next: () => {
        this.deleteMessages();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadHistory() {
    this.isReady.update((state) => ({ ...state, history: false }));
    this._messages.set([]);
    this.httpApi
      .getHistory()
      .pipe(
        finalize(() => {
          this.isReady.update((state) => ({ ...state, history: true }));
        }),
      )
      .subscribe({
        next: (messages) => {
          this.unpdateMessages(messages);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  private handleError = (response: unknown) => {
    const error = response as AiError;
    this.updateErrorMessage(error);
    this.updateStatus('error');
  };

  private updateErrorMessage(error: AiError) {
    if (error.type === 'provider_error' || error.type === 'server_error') {
      switch (error.status) {
        case 400: {
          this.errorMessage.set({
            ...error,
            message: 'Invalid or empty AI Model',
          });
          break;
        }
        case 401: {
          this.errorMessage.set({
            ...error,
            message: 'Invalid or empty API key',
          });
          break;
        }
        case 402: {
          this.errorMessage.set({
            ...error,
            message: 'Limit for this API key exceeded',
          });
          break;
        }
        case 403: {
          this.errorMessage.set({
            ...error,
            message: 'You does not have access to this model',
          });
          break;
        }
        case 404: {
          this.errorMessage.set({
            ...error,
            message: 'Not found model or this model does not exist',
          });
          break;
        }
        case 408: {
          this.errorMessage.set({
            ...error,
            message: 'Request timeout. Try to clear chat history',
          });
          break;
        }
        case 422: {
          this.errorMessage.set({
            ...error,
            message: 'Failed to process your request. Try to clear chat history',
          });
          break;
        }

        case 429: {
          this.errorMessage.set({
            ...error,
            message: 'To many requests. Try again later',
          });
          break;
        }

        case 500: {
          this.errorMessage.set({
            ...error,
            message: 'Internal Server Error. Try to change model or try again later',
          });
          break;
        }

        case 503: {
          this.errorMessage.set({
            ...error,
            message: 'Failed to connect. Try again later...',
          });
          break;
        }
        default: {
          console.error(error);
          this.errorMessage.set(unknownError);
        }
      }
    } else {
      this.errorMessage.set(unknownError);
    }
  }

  private handleUnknownError(error: unknown) {
    console.error(error);
    this.updateErrorMessage(unknownError);
    this.updateStatus('error');
  }

  private deleteMessages() {
    this._messages.set([]);
  }

  private unpdateMessages(messages: AiMessage[]) {
    this._messages.update((array) => [...array, ...messages]);
  }

  private subscribeToEvent(event: string, handler: (data: unknown) => void) {
    const sub = this.wsApi.listen(event).subscribe(handler);
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
      this.isReady.update((state) => ({ ...state, socket: true }));
    });
  };

  private handleDisconnect = () => {
    this.zone.run(() => {
      this.isReady.update((state) => ({ ...state, socket: false }));
    });
  };

  private handleConnectionError = () => {
    this.zone.run(() => {
      this.isReady.update((state) => ({ ...state, socket: false }));
    });
  };
}
