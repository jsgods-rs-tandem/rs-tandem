type Role = 'user' | 'assistant' | 'system';

export interface IMessage {
  role: Role;
  content: string;
}

export interface IErrorResponse {
  error: boolean;
  message: string;
}
