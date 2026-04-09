import type { AiMessage } from '@rs-tandem/shared';
import type { AiProviderMeta, IAiProvider } from './ai-provider.interface.js';
import { openrouterStreamToAsyncIterable } from '../utils/openrouter-stream-to-async-iterable.js';
import OpenRouterError from '../errors/openrouter-error.js';
import { error } from '../errors/errors.js';
import { Logger } from '@nestjs/common';

export class OpenRouterProvider implements IAiProvider {
  readonly meta: AiProviderMeta = {
    id: 'openrouter',
    label: 'Open Router',
    requiresKey: true,
  };
  private logger = new Logger(this.meta.label);

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
      throw new OpenRouterError('Model is not set', error.BadRequest);
    }
    if (!apiKey) {
      throw new OpenRouterError('Api key is required', error.Unauthorized);
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
    } catch (_error) {
      this.logger.error(_error);
      throw new OpenRouterError(`Failed to connect`, error.ServiceUnavailable);
    }

    if (!response.ok) {
      throw new OpenRouterError(`Responded with ${String(response.status)}`, response.status);
    }

    if (!response.body) {
      throw new OpenRouterError(`Response body is null`, error.ServiceUnavailable);
    }

    return openrouterStreamToAsyncIterable(Promise.resolve(response.body));
  }

  private getBaseUrl() {
    return process.env.OPENROUTER_BASE_URL ?? 'http://localhost:11434';
  }
}
