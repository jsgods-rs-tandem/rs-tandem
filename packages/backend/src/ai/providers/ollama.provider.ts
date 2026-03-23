import type { AiMessage } from '@rs-tandem/shared';
import type { AiProviderMeta, IAiProvider } from './ai-provider.interface.js';
import { ollamaStreamToAsyncIterable } from '../utils/ollama-stream-to-async-iterable.js';

interface OllamaChatResponse {
  message: {
    content: string;
  };
}

function isOllamaChatResponse(value: unknown): value is OllamaChatResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as Record<string, unknown>).message === 'object' &&
    (value as Record<string, unknown>).message !== null &&
    typeof ((value as Record<string, unknown>).message as Record<string, unknown>).content ===
      'string'
  );
}

export class OllamaProvider implements IAiProvider {
  constructor(
    private readonly baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
    private readonly model = process.env.OLLAMA_MODEL ?? 'gemma3:1b',
  ) {}

  readonly meta: AiProviderMeta = {
    id: 'ollama',
    label: 'Ollama (local)',
    requiresKey: false,
  };

  async streamChat(messages: AiMessage[]): Promise<AsyncIterable<string>> {
    const response = await this.sendPrompt(messages, true);

    if (!response.ok) {
      throw new Error(`Ollama responded with ${String(response.status)}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    return ollamaStreamToAsyncIterable(Promise.resolve(response.body));
  }

  async chat(messages: AiMessage[], _apiKey: string | null): Promise<string> {
    const response = await this.sendPrompt(messages, false);

    if (!response.ok) {
      throw new Error(`Ollama responded with ${String(response.status)}`);
    }

    const data: unknown = await response.json();

    if (!isOllamaChatResponse(data)) {
      throw new Error('Unexpected Ollama response shape');
    }

    return data.message.content;
  }

  private sendPrompt(messages: AiMessage[], stream: boolean) {
    return fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: this.model, messages, stream }),
      signal: AbortSignal.timeout(30_000),
    });
  }
}
