import type { AiMessage } from '@rs-tandem/shared';

export interface AiProviderMeta {
  id: string;
  label: string;
  requiresKey: boolean;
}

export interface IAiProvider {
  readonly meta: AiProviderMeta;
  chat(messages: AiMessage[], model: string | null, apiKey: string | null): Promise<string>;
  streamChat(
    messages: AiMessage[],
    model: string | null,
    apiKey: string | null,
  ): Promise<AsyncIterable<string>>;
}
