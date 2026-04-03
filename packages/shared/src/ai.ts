export type AiMessageRole = 'user' | 'assistant' | 'system';

export interface AiMessage {
  role: AiMessageRole;
  content: string;
}

export interface AiProviderDto {
  id: string;
  label: string;
  requiresKey: boolean;
}

export interface AiSettingsDto {
  providerId: string;
  model: string | null;
  apiKey: string | null;
}

export interface UpdateAiSettingsDto {
  providerId: string;
  model: string | null;
  apiKey: string | null;
}

export interface AiChatRequestDto {
  messages: AiMessage[];
}

export type AiChatResponseDto = string;

export type UserMessageDto = Omit<AiMessage, 'role'>;

export interface AiError {
  type: 'provider_error' | 'unknown_error';
  title: string;
  message: string;
  status: number;
}
