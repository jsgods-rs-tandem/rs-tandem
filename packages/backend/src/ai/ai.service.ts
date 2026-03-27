import { BadGatewayException, BadRequestException, Injectable, Logger } from '@nestjs/common';
import type { AiChatResponseDto, AiMessage, AiProviderDto, AiSettingsDto } from '@rs-tandem/shared';
import { AiSettingsRepository } from './ai-settings.repository.js';
import { AI_PROVIDERS, findProvider } from './providers/ai-provider.registry.js';
import type { AiChatDto } from './dto/ai-chat.dto.js';
import type { UpdateAiSettingsDto } from './dto/update-ai-settings.dto.js';
import { ChatHistoryService } from '../chat-history/chat-history.service.js';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly aiSettingsRepository: AiSettingsRepository,
    private readonly chatHistoryService: ChatHistoryService,
  ) {}

  getProviders(): AiProviderDto[] {
    return AI_PROVIDERS.map((p) => ({
      id: p.meta.id,
      label: p.meta.label,
      requiresKey: p.meta.requiresKey,
    }));
  }

  private async setDefaultSettings(userId: string): Promise<AiSettingsDto> {
    await this.updateMySettings(userId, { providerId: 'ollama' });
    const settings = await this.aiSettingsRepository.findByUserId(userId);
    if (!settings) {
      throw new BadRequestException('No AI provider selected');
    }

    return {
      providerId: settings.providerId,
      hasKey: settings.apiKey !== null,
      apiKey: settings.apiKey,
    };
  }

  async getMySettings(userId: string): Promise<AiSettingsDto> {
    const settings = await this.aiSettingsRepository.findByUserId(userId);

    if (!settings) {
      // Remove default settings after implementing the model selection functionality
      return this.setDefaultSettings(userId);
    }

    return {
      providerId: settings.providerId,
      hasKey: settings.apiKey !== null,
      apiKey: settings.apiKey,
    };
  }

  async updateMySettings(userId: string, dto: UpdateAiSettingsDto): Promise<AiSettingsDto> {
    const provider = findProvider(dto.providerId);

    if (!provider) {
      throw new BadRequestException('Unknown AI provider');
    }

    const settings = await this.aiSettingsRepository.upsert({
      userId,
      providerId: dto.providerId,
      apiKey: null,
      // For key-requiring providers, preserve the existing key rather than clobber it on a
      // provider-only update. Callers must use a dedicated key-update endpoint to change the key.
      preserveExistingKey: provider.meta.requiresKey,
    });

    return {
      providerId: settings.providerId,
      hasKey: settings.apiKey !== null,
      apiKey: settings.apiKey,
    };
  }

  getMyProvider(settings: AiSettingsDto) {
    const provider = findProvider(settings.providerId);

    if (!provider) {
      throw new BadRequestException('No AI provider selected');
    }

    if (provider.meta.requiresKey && settings.apiKey === null) {
      throw new BadRequestException('API key required for this provider');
    }

    return provider;
  }

  async saveMessage(userId: string, message: AiMessage) {
    await this.chatHistoryService.pushMessage(userId, message);
  }

  async getPrompt(userId: string) {
    return await this.chatHistoryService.getHistory(userId);
  }

  async *streamChat(userId: string, message: AiMessage): AsyncIterable<string> {
    await this.saveMessage(userId, message);
    const messages = await this.getPrompt(userId);
    const settings = await this.getMySettings(userId);
    const provider = this.getMyProvider(settings);

    try {
      const stream = await provider.streamChat(messages, settings.apiKey);
      let content = '';
      for await (const chunk of stream) {
        content = `${content}${chunk}`;
        yield chunk;
      }

      const message: AiMessage = {
        role: 'assistant',
        content,
      };
      await this.saveMessage(userId, message);
    } catch (error) {
      this.logger.error('AI provider error', error instanceof Error ? error.stack : String(error));
      throw new BadGatewayException('AI provider unavailable');
    }
  }

  async chat(userId: string, dto: AiChatDto): Promise<AiChatResponseDto> {
    const settings = await this.aiSettingsRepository.findByUserId(userId);

    if (!settings) {
      throw new BadRequestException('No AI provider selected');
    }

    const provider = findProvider(settings.providerId);

    if (!provider) {
      throw new BadRequestException('No AI provider selected');
    }

    if (provider.meta.requiresKey && settings.apiKey === null) {
      throw new BadRequestException('API key required for this provider');
    }

    try {
      const content = await provider.chat(dto.messages, settings.apiKey);

      return content;
    } catch (error) {
      this.logger.error('AI provider error', error instanceof Error ? error.stack : String(error));
      throw new BadGatewayException('AI provider unavailable');
    }
  }
}
