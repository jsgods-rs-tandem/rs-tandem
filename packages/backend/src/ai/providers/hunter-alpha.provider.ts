import type { AiMessage } from '@rs-tandem/shared';
import type { AiProviderMeta, IAiProvider } from './ai-provider.interface.js';
import { streamToAsyncIterable } from '../../common/utils/stream-to-async-iterable.js';

export class HunterAlphaProvider implements IAiProvider {
  constructor(
    private readonly baseUrl = process.env.HUNTER_ALPHA_BASE_URL,
    private readonly model = process.env.HUNTER_ALPHA_MODEL,
  ) {}

  readonly meta: AiProviderMeta = {
    id: 'hunter-alpha',
    label: 'Hunter Alpha',
    requiresKey: true,
  };

  async chat(messages: AiMessage[], apiKey: string | null): Promise<string> {
    const stream = this.streamChat(messages, apiKey);
    const asyncIterable = streamToAsyncIterable(stream);
    let message = '';
    for await (const chunk of asyncIterable) {
      message += chunk;
    }

    return message;
  }

  async streamChat(
    messages: AiMessage[],
    apiKey: string | null,
  ): Promise<ReadableStream<Uint8Array>> {
    if (!this.baseUrl) {
      throw new Error('HUNTER_ALPHA_BASE_URL is not set');
    }
    if (!this.model) {
      throw new Error('HUNTER_ALPHA_MODEL is not set');
    }
    if (!apiKey) {
      throw new Error('API key is required for Hunter Alpha provider');
    }

    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: this.model,
        messages,
        reasoning: { enabled: true },
        stream: true,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      throw new Error(`Hunter Alpha responded with ${String(response.status)}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    return response.body;
  }
}
