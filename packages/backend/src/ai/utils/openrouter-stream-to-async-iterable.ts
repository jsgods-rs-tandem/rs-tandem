import { error } from '../errors/errors';
import OpenRouterError from '../errors/openrouter-error';

interface ChoiceDelta {
  content?: string;
}

interface ChatCompletionChunk {
  choices: {
    delta: ChoiceDelta;
  }[];
}

function isChatCompletionChunk(json: unknown): json is ChatCompletionChunk {
  return (
    typeof json === 'object' &&
    json !== null &&
    'choices' in json &&
    Array.isArray(json.choices) &&
    json.choices.every(
      (choice: unknown) =>
        typeof choice === 'object' &&
        choice !== null &&
        'delta' in choice &&
        typeof choice.delta === 'object' &&
        choice.delta !== null,
    )
  );
}

export async function* openrouterStreamToAsyncIterable(
  streamPromise: Promise<ReadableStream<Uint8Array>>,
): AsyncIterable<string> {
  const stream = await streamPromise;
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.replace('data: ', '').trim();
      if (data === '[DONE]') return;

      try {
        const json: unknown = JSON.parse(data);
        if (!isChatCompletionChunk(json)) {
          throw new OpenRouterError(
            'Invalid content structure in chunk of stream',
            error.InternalServerError,
          );
        }
        const text = json.choices[0]?.delta.content;
        if (text) yield text;
      } catch {
        throw new OpenRouterError('Failed to parse chunk of stream', error.InternalServerError);
      }
    }
  }

  if (buffer.startsWith('data: ')) {
    try {
      const json: unknown = JSON.parse(buffer.replace('data: ', '').trim());
      if (!isChatCompletionChunk(json)) {
        throw new OpenRouterError(
          'Invalid content structure in final chunk of stream',
          error.InternalServerError,
        );
      }
      const text = json.choices[0]?.delta.content;
      if (text) yield text;
    } catch {
      throw new OpenRouterError('Failed to parse final chunk of stream', error.InternalServerError);
    }
  }
}
