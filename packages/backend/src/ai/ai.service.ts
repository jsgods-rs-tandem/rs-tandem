import { BadGatewayException, BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  type AiChatResponseDto,
  type AiMessage,
  type AiProviderDto,
  type AiSettingsDto,
} from '@rs-tandem/shared';
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
      throw new BadRequestException('ai.provider_not_selected');
    }

    return {
      providerId: settings.providerId,
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
      apiKey: settings.apiKey,
    };
  }

  async updateMySettings(userId: string, dto: UpdateAiSettingsDto): Promise<AiSettingsDto> {
    const provider = findProvider(dto.providerId);

    if (!provider) {
      throw new BadRequestException('ai.provider_unknown');
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
      apiKey: settings.apiKey,
    };
  }

  getMyProvider(settings: AiSettingsDto) {
    const provider = findProvider(settings.providerId);

    if (!provider) {
      throw new BadRequestException('ai.provider_not_selected');
    }

    if (provider.meta.requiresKey && settings.apiKey === null) {
      throw new BadRequestException('ai.api_key_required');
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
    const [messages, settings] = await Promise.all([
      this.getPrompt(userId),
      this.getMySettings(userId),
    ]);
    const provider = this.getMyProvider(settings);

    try {
      const stream = await provider.streamChat(messages, settings.apiKey);
      let content = '';
      for await (const chunk of stream) {
        content = `${content}${chunk}`;
        yield chunk;
      }
      content = `${content}\n`;
      yield '\n';

      const message: AiMessage = {
        role: 'assistant',
        content,
      };
      await this.saveMessage(userId, message);
    } catch (error) {
      this.logger.error('AI provider error', error instanceof Error ? error.stack : String(error));
      throw new BadGatewayException('ai.provider_unavailable');
    }
  }

  async chat(userId: string, dto: AiChatDto): Promise<AiChatResponseDto> {
    const settings = await this.aiSettingsRepository.findByUserId(userId);

    if (!settings) {
      throw new BadRequestException('ai.provider_not_selected');
    }

    const provider = findProvider(settings.providerId);

    if (!provider) {
      throw new BadRequestException('ai.provider_not_selected');
    }

    if (provider.meta.requiresKey && settings.apiKey === null) {
      throw new BadRequestException('ai.api_key_required');
    }

    try {
      const content = await provider.chat(dto.messages, settings.apiKey);

      return content;
    } catch (error) {
      this.logger.error('AI provider error', error instanceof Error ? error.stack : String(error));
      throw new BadGatewayException('ai.provider_unavailable');
    }
  }
}
