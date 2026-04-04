import { AiMessage } from '@rs-tandem/shared';
import OllamaError from '../errors/ollama-error';
import { error } from '../errors/errors';

interface ChatChunk {
  message: AiMessage;
}

function isChatChunk(chunk: unknown): chunk is ChatChunk {
  if (typeof chunk !== 'object' || chunk === null) return false;

  const maybeChunk = chunk as Record<string, unknown>;
  const message = maybeChunk.message;

  if (typeof message !== 'object' || message === null) return false;

  const maybeMessage = message as Record<string, unknown>;

  return typeof maybeMessage.role === 'string' && typeof maybeMessage.content === 'string';
}

export async function* ollamaStreamToAsyncIterable(
  streamPromise: Promise<ReadableStream<Uint8Array>>,
): AsyncIterable<string> {
  const stream = await streamPromise;
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const data = decoder.decode(value, { stream: true });
    const chunk: unknown = JSON.parse(data);
    if (!isChatChunk(chunk)) {
      throw new OllamaError(`Invalid chunk format`, error.InternalServerError);
    }
    yield chunk.message.content;
  }
}
