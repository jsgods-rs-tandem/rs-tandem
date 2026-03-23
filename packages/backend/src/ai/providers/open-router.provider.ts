import type { AiMessage } from '@rs-tandem/shared';
import type { AiProviderMeta, IAiProvider } from './ai-provider.interface.js';
import { openrouterStreamToAsyncIterable } from '../utils/openrouter-stream-to-async-iterable.js';

export class OpenRouterProvider implements IAiProvider {
  constructor(
    private readonly baseUrl = process.env.OPENROUTER_BASE_URL,
    private readonly model = process.env.OPENROUTER_MODEL,
  ) {}

  readonly meta: AiProviderMeta = {
    id: 'openrouter',
    label: 'Open Router',
    requiresKey: true,
  };

  async chat(messages: AiMessage[], apiKey: string | null): Promise<string> {
    const asyncIterable = await this.streamChat(messages, apiKey);
    let message = '';
    for await (const chunk of asyncIterable) {
      message += chunk;
    }

    return message;
  }

  async streamChat(messages: AiMessage[], apiKey: string | null): Promise<AsyncIterable<string>> {
    if (!this.baseUrl) {
      throw new Error('OPENROUTER_BASE_URL is not set');
    }
    if (!this.model) {
      throw new Error('OPENROUTER_MODEL is not set');
    }
    if (!apiKey) {
      throw new Error('API key is required for Open Router provider');
    }
    let response;
    try {
      response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: this.model,
          messages,
          reasoning: { enabled: true },
          stream: true,
        }),
      });
    } catch (error) {
      throw new Error(
        `Failed to connect to Open Router API: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (!response.ok) {
      throw new Error(`Open Router responded with ${String(response.status)}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    return openrouterStreamToAsyncIterable(Promise.resolve(response.body));
  }
}
