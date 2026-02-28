import { ChatResponse } from 'ollama';

type Role = 'user' | 'assistant' | 'system';

export interface IMessage {
  role: Role;
  content: string;
}

export interface IStreamMessage {
  role: 'assistant';
  content: AsyncIterable<ChatResponse>;
}

export interface IErrorResponse {
  error: boolean;
  message: string;
}
