jest.mock('./providers/ai-provider.registry.js', () => ({
  AI_PROVIDERS: [
    {
      meta: { id: 'ollama', label: 'Ollama (local)', requiresKey: false },
      chat: jest.fn(),
    },
    {
      meta: { id: 'paid-provider', label: 'Paid', requiresKey: true },
      chat: jest.fn(),
    },
  ],
  findProvider: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BadGatewayException, BadRequestException, Logger } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { AiSettingsRepository } from './ai-settings.repository.js';
import { AI_PROVIDERS, findProvider } from './providers/ai-provider.registry.js';
import { ChatHistoryService } from '../chat-history/chat-history.service.js';

const mockFindProvider = jest.mocked(findProvider);
const ollamaProvider = AI_PROVIDERS[0]!;
const paidProvider = AI_PROVIDERS[1]!;
const mockOllamaChat = jest.mocked(ollamaProvider.chat);

const mockAiSettingsRepository = {
  findByUserId: jest.fn(),
  upsert: jest.fn(),
};

const mockChatHistoryService = {
  getHistory: jest.fn(),
  pushMessage: jest.fn(),
  clearHistory: jest.fn(),
};

const now = new Date('2024-06-01T12:00:00.000Z');

const ollamaSettings = {
  userId: 'u1',
  providerId: 'ollama',
  apiKey: null,
  createdAt: now,
  updatedAt: now,
};

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: AiSettingsRepository, useValue: mockAiSettingsRepository },
        { provide: ChatHistoryService, useValue: mockChatHistoryService },
      ],
    }).compile();
    service = module.get(AiService);
  });

  describe('getProviders', () => {
    it('returns list of providers with id, label, requiresKey', () => {
      const result = service.getProviders();

      expect(result).toEqual([
        { id: 'ollama', label: 'Ollama (local)', requiresKey: false },
        { id: 'paid-provider', label: 'Paid', requiresKey: true },
      ]);
    });
  });

  describe('getMySettings', () => {
    it('returns AiSettingsDto when settings exist', async () => {
      mockAiSettingsRepository.findByUserId.mockResolvedValue(ollamaSettings);

      const result = await service.getMySettings('u1');

      expect(result).toEqual({ providerId: 'ollama', hasKey: false });
    });

    it('returns hasKey true when apiKey is set', async () => {
      mockAiSettingsRepository.findByUserId.mockResolvedValue({
        ...ollamaSettings,
        apiKey: 'secret',
      });

      const result = await service.getMySettings('u1');

      expect(result.hasKey).toBe(true);
    });

    it('throws BadRequestException when no settings found', async () => {
      mockAiSettingsRepository.findByUserId.mockResolvedValue(undefined);

      await expect(service.getMySettings('u1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateMySettings', () => {
    it('upserts settings with preserveExistingKey false for key-free provider', async () => {
      mockFindProvider.mockReturnValue(ollamaProvider);
      mockAiSettingsRepository.upsert.mockResolvedValue(ollamaSettings);

      const result = await service.updateMySettings('u1', { providerId: 'ollama' });

      expect(mockAiSettingsRepository.upsert).toHaveBeenCalledWith({
        userId: 'u1',
        providerId: 'ollama',
        apiKey: null,
        preserveExistingKey: false,
      });
      expect(result).toEqual({ providerId: 'ollama', hasKey: false });
    });

    it('upserts with preserveExistingKey true for key-requiring provider', async () => {
      mockFindProvider.mockReturnValue(paidProvider);
      mockAiSettingsRepository.upsert.mockResolvedValue({
        ...ollamaSettings,
        providerId: 'paid-provider',
        apiKey: 'existing-key',
      });

      await service.updateMySettings('u1', { providerId: 'paid-provider' });

      expect(mockAiSettingsRepository.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ preserveExistingKey: true }),
      );
    });

    it('throws BadRequestException for unknown provider', async () => {
      mockFindProvider.mockReturnValue(undefined);

      await expect(service.updateMySettings('u1', { providerId: 'unknown' })).rejects.toThrow(
        BadRequestException,
      );
      expect(mockAiSettingsRepository.upsert).not.toHaveBeenCalled();
    });
  });

  describe('chat', () => {
    it('returns content from provider on success', async () => {
      mockAiSettingsRepository.findByUserId.mockResolvedValue(ollamaSettings);
      mockFindProvider.mockReturnValue(ollamaProvider);
      mockOllamaChat.mockResolvedValue('Hello!');

      const result = await service.chat('u1', {
        messages: [{ role: 'user', content: 'Hi' }],
      });

      expect(result).toEqual('Hello!');
    });

    it('passes messages and apiKey to provider', async () => {
      const messages = [{ role: 'user' as const, content: 'Hi' }];
      mockAiSettingsRepository.findByUserId.mockResolvedValue({
        ...ollamaSettings,
        apiKey: 'key',
      });
      mockFindProvider.mockReturnValue(ollamaProvider);
      mockOllamaChat.mockResolvedValue('reply');

      await service.chat('u1', { messages });

      expect(mockOllamaChat).toHaveBeenCalledWith(messages, 'key');
    });

    it('throws BadRequestException when no settings found', async () => {
      mockAiSettingsRepository.findByUserId.mockResolvedValue(undefined);

      await expect(
        service.chat('u1', { messages: [{ role: 'user', content: 'Hi' }] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when provider not found', async () => {
      mockAiSettingsRepository.findByUserId.mockResolvedValue(ollamaSettings);
      mockFindProvider.mockReturnValue(undefined);

      await expect(
        service.chat('u1', { messages: [{ role: 'user', content: 'Hi' }] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when provider requires key but apiKey is null', async () => {
      mockAiSettingsRepository.findByUserId.mockResolvedValue({
        ...ollamaSettings,
        providerId: 'paid-provider',
        apiKey: null,
      });
      mockFindProvider.mockReturnValue(paidProvider);

      await expect(
        service.chat('u1', { messages: [{ role: 'user', content: 'Hi' }] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadGatewayException when provider.chat throws', async () => {
      mockAiSettingsRepository.findByUserId.mockResolvedValue(ollamaSettings);
      mockFindProvider.mockReturnValue(ollamaProvider);
      mockOllamaChat.mockRejectedValue(new Error('Connection refused'));

      await expect(
        service.chat('u1', { messages: [{ role: 'user', content: 'Hi' }] }),
      ).rejects.toThrow(BadGatewayException);
    });
  });
});
