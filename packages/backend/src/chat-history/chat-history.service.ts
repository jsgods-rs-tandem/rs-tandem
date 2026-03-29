import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ChatHistoryRepository } from './chat-history.repository';
import { AiMessage } from '@rs-tandem/shared';
import { ChatHistoryRow } from './chat-history.entity';
import { AiMessageRole } from 'packages/shared/src/ai';

function isAiMessageRole(role: string): role is AiMessageRole {
  return role === 'user' || role === 'assistant' || role === 'system';
}

function toAiMessage(row: ChatHistoryRow): AiMessage {
  if (!isAiMessageRole(row.role)) {
    throw new Error('Invalid type for AiMessage role');
  }

  return {
    role: row.role,
    content: row.content,
  };
}

@Injectable()
export class ChatHistoryService {
  private readonly logger = new Logger(ChatHistoryService.name);
  constructor(private readonly chatHistoryRepository: ChatHistoryRepository) {}

  async getHistory(userId: string): Promise<AiMessage[]> {
    try {
      const history = await this.chatHistoryRepository.findByUserIdSortedByUpdatedAt(userId);
      return history.map((row) => toAiMessage(row));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('db.request_failed');
    }
  }

  async pushMessage(userId: string, message: AiMessage): Promise<AiMessage> {
    try {
      const row = await this.chatHistoryRepository.upsert({
        userId,
        role: message.role,
        content: message.content,
      });
      return toAiMessage(row);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('db.request_failed');
    }
  }

  async clearHistory(userId: string): Promise<void> {
    try {
      await this.chatHistoryRepository.deleteByUserId(userId);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('db.request_failed');
    }
  }
}
