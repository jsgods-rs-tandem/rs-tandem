import { OllamaProvider } from './ollama.provider.js';
import type { AiMessage } from '@rs-tandem/shared';

const messages: AiMessage[] = [{ role: 'user', content: 'Hello' }];

describe('OllamaProvider', () => {
  let provider: OllamaProvider;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    provider = new OllamaProvider();
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('has correct meta', () => {
    expect(provider.meta).toEqual({
      id: 'ollama',
      label: 'Ollama (local)',
      requiresKey: false,
    });
  });

  describe('chat', () => {
    it('returns message content on success', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: { content: 'Hello!' } }),
      } as Response);

      const result = await provider.chat(messages, null);

      expect(result).toBe('Hello!');
    });

    it('calls the correct URL with model and messages', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: { content: 'reply' } }),
      } as Response);

      await provider.chat(messages, null);

      expect(fetchSpy).toHaveBeenCalledWith(
        'http://localhost:11434/api/chat',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ model: 'qwen2.5:0.5b', messages, stream: false }),
        }),
      );
    });

    it('throws when response is not ok', async () => {
      fetchSpy.mockResolvedValue({ ok: false, status: 503 } as Response);

      await expect(provider.chat(messages, null)).rejects.toThrow(Error);
    });

    it('throws when response shape is missing message field', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ unexpected: true }),
      } as Response);

      await expect(provider.chat(messages, null)).rejects.toThrow(
        'Unexpected Ollama response shape',
      );
    });

    it('throws when message.content is not a string', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: { content: 42 } }),
      } as Response);

      await expect(provider.chat(messages, null)).rejects.toThrow(
        'Unexpected Ollama response shape',
      );
    });
  });
});
