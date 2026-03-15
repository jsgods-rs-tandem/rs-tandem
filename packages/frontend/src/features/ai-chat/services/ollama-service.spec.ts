import { TestBed } from '@angular/core/testing';

import { OllamaService } from './ollama-service';
import { IMessage } from '../models/llm-message-model';
import { isAsyncIterable } from '@/core/guards/is-async-iterable';

describe('OllamaService', () => {
  let service: OllamaService;
  const messages: IMessage[] = [{ role: 'user', content: 'Hello, Ollama!' }];
  const model = 'gemma3:1b';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OllamaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an async iterable', async () => {
    Object.defineProperty(service, 'ollama', {
      value: {
        chat: () => ({
          async *[Symbol.asyncIterator]() {
            await new Promise((resolve) => setTimeout(resolve, 100));
            yield { message: 'Hello from Ollama!' };
          },
        }),
      },
    });

    expect(isAsyncIterable(await service.sendPrompt(messages, model))).toBe(true);
  });

  it('should return an error response on failure', async () => {
    Object.defineProperty(service, 'ollama', {
      value: {
        chat: () => {
          throw new Error('Chat failed');
        },
      },
    });

    const response = await service.sendPrompt(messages, model);
    expect(response).toEqual({
      error: true,
      message: 'Failed to get model response',
    });
  });
});
