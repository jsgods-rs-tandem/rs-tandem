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
    const controller = new AbortController();
    const timeoutID = setTimeout(() => {
      controller.abort();
    }, 30_000);
    return fetch(`${this.getBaseUrl()}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: this.getModel(), messages, stream }),
      signal: controller.signal,
    }).then((response) => {
      clearTimeout(timeoutID);
      return response;
    });
  }

  private getModel() {
    return process.env.OLLAMA_MODEL ?? 'qwen2.5:0.5b';
  }

  private getBaseUrl() {
    return process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
  }
}
