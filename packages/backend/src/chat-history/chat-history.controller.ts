import { Controller, Delete, Get, Request, UseGuards } from '@nestjs/common';
import { UserDto } from '@rs-tandem/shared';
import { ChatHistoryService } from './chat-history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat-history')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory(@Request() request: Express.Request) {
    const user = request.user as UserDto;

    return this.chatHistoryService.getHistory(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('history')
  deleteHistory(@Request() request: Express.Request) {
    const user = request.user as UserDto;

    return this.chatHistoryService.clearHistory(user.id);
  }
}
