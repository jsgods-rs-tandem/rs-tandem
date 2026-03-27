import { Module } from '@nestjs/common';
import { ChatHistoryController } from './chat-history.controller';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistoryRepository } from './chat-history.repository';

@Module({
  providers: [ChatHistoryService, ChatHistoryRepository],
  controllers: [ChatHistoryController],
  exports: [ChatHistoryService, ChatHistoryRepository],
})
export class ChatHistoryModule {}
