import { Test, TestingModule } from '@nestjs/testing';
import type { AiProviderDto, AiSettingsDto, AiChatResponseDto, UserDto } from '@rs-tandem/shared';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AiThrottlerGuard } from './guards/ai-throttler.guard.js';
import { AiChatDto } from './dto/ai-chat.dto.js';
import { UpdateAiSettingsDto } from './dto/update-ai-settings.dto.js';

const mockAiService = {
  getProviders: jest.fn(),
  getMySettings: jest.fn(),
  updateMySettings: jest.fn(),
  chat: jest.fn(),
};

const userFixture: UserDto = {
  id: 'u1',
  email: 'a@b.com',
  displayName: 'Alice',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const providersFixture: AiProviderDto[] = [
  { id: 'ollama', label: 'Ollama (local)', requiresKey: false },
];

const settingsFixture: AiSettingsDto = { providerId: 'ollama', model: null, apiKey: null };

describe('AiController', () => {
  let controller: AiController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [{ provide: AiService, useValue: mockAiService }],
    })
      .overrideGuard(AiThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get(AiController);
  });

  describe('getProviders', () => {
    it('delegates to aiService.getProviders and returns result', () => {
      mockAiService.getProviders.mockReturnValue(providersFixture);

      const result = controller.getProviders();

      expect(mockAiService.getProviders).toHaveBeenCalled();
      expect(result).toBe(providersFixture);
    });

    it('is not protected by JwtAuthGuard', () => {
      const handler = Object.getOwnPropertyDescriptor(AiController.prototype, 'getProviders')
        ?.value as object;
      const guards = (Reflect.getMetadata('__guards__', handler) ?? []) as unknown[];

      expect(guards).not.toContain(JwtAuthGuard);
    });
  });

  describe('getMySettings', () => {
    it('delegates to aiService.getMySettings with user id', async () => {
      const request = { user: userFixture } as unknown as Express.Request;
      mockAiService.getMySettings.mockResolvedValue(settingsFixture);

      const result = await controller.getMySettings(request);

      expect(mockAiService.getMySettings).toHaveBeenCalledWith('u1');
      expect(result).toBe(settingsFixture);
    });

    it('is protected by JwtAuthGuard', () => {
      const handler = Object.getOwnPropertyDescriptor(AiController.prototype, 'getMySettings')
        ?.value as object;
      const guards = Reflect.getMetadata('__guards__', handler) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
    });
  });

  describe('updateMySettings', () => {
    it('delegates to aiService.updateMySettings with user id and dto', async () => {
      const request = { user: userFixture } as unknown as Express.Request;
      const dto = { providerId: 'ollama' } as UpdateAiSettingsDto;
      mockAiService.updateMySettings.mockResolvedValue(settingsFixture);

      const result = await controller.updateMySettings(request, dto);

      expect(mockAiService.updateMySettings).toHaveBeenCalledWith('u1', dto);
      expect(result).toBe(settingsFixture);
    });

    it('is protected by JwtAuthGuard', () => {
      const handler = Object.getOwnPropertyDescriptor(AiController.prototype, 'updateMySettings')
        ?.value as object;
      const guards = Reflect.getMetadata('__guards__', handler) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
    });
  });

  describe('chat', () => {
    it('delegates to aiService.chat with user id and dto', async () => {
      const request = { user: userFixture } as unknown as Express.Request;
      const dto = { messages: [{ role: 'user' as const, content: 'Hi' }] } as AiChatDto;
      const responseFixture: AiChatResponseDto = 'Hello!';
      mockAiService.chat.mockResolvedValue(responseFixture);

      const result = await controller.chat(request, dto);

      expect(mockAiService.chat).toHaveBeenCalledWith('u1', dto);
      expect(result).toBe(responseFixture);
    });

    it('is protected by JwtAuthGuard', () => {
      const handler = Object.getOwnPropertyDescriptor(AiController.prototype, 'chat')
        ?.value as object;
      const guards = Reflect.getMetadata('__guards__', handler) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
    });

    it('is protected by AiThrottlerGuard', () => {
      const handler = Object.getOwnPropertyDescriptor(AiController.prototype, 'chat')
        ?.value as object;
      const guards = Reflect.getMetadata('__guards__', handler) as unknown[];

      expect(guards).toContain(AiThrottlerGuard);
    });
  });
});
