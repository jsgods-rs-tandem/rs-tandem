export interface AiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiProviderDto {
  id: string;
  label: string;
  requiresKey: boolean;
}

export interface AiSettingsDto {
  providerId: string;
  hasKey: boolean;
}

export interface UpdateAiSettingsDto {
  providerId: string;
}

export interface AiChatRequestDto {
  messages: AiMessage[];
}

export type AiChatResponseDto = string;

export type UserMessageDto = Omit<AiMessage, 'role'>;
