import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { IMessage } from '../models/llm-message-model';

@Injectable({
  providedIn: 'root',
})
export class AiSocketService {
  private socket: Socket;
  private readonly url = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.url, { auth: { token: localStorage.getItem('auth_token') } });
  }

  emit(event: string, data: IMessage) {
    this.socket.emit(event, data);
  }

  listen<T>(event: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.socket.on(event, (data: T) => {
        subscriber.next(data);
      });
      return () => this.socket.off(event);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
