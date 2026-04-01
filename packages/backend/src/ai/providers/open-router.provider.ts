import type { AiMessage } from '@rs-tandem/shared';
import type { AiProviderMeta, IAiProvider } from './ai-provider.interface.js';
import { openrouterStreamToAsyncIterable } from '../utils/openrouter-stream-to-async-iterable.js';

export class OpenRouterProvider implements IAiProvider {
  readonly meta: AiProviderMeta = {
    id: 'openrouter',
    label: 'Open Router',
    requiresKey: true,
  };

  async chat(messages: AiMessage[], model: string | null, apiKey: string | null): Promise<string> {
    const asyncIterable = await this.streamChat(messages, model, apiKey);
    let message = '';
    for await (const chunk of asyncIterable) {
      message += chunk;
    }

    return message;
  }

  async streamChat(
    messages: AiMessage[],
    model: string | null,
    apiKey: string | null,
  ): Promise<AsyncIterable<string>> {
    if (!this.getBaseUrl()) {
      throw new Error('OPENROUTER_BASE_URL is not set');
    }
    if (!model) {
      throw new Error('OPENROUTER_MODEL is not set');
    }
    if (!apiKey) {
      throw new Error('API key is required for Open Router provider');
    }
    let response;
    try {
      response = await fetch(`${this.getBaseUrl()}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
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

  private getBaseUrl() {
    return process.env.OPENROUTER_BASE_URL ?? 'http://localhost:11434';
  }
}
