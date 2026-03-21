import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AiService } from './ai.service.js';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt-auth.guard.js';
import type { AiChatResponseDto, AiMessage, AuthenticatedSocket } from 'packages/shared/src/ai.js';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class AiWSGController {
  constructor(private readonly aiService: AiService) {}

  @WebSocketServer()
  server!: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody() prompt: AiMessage,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const user = client.data.user;
    const userId = user.id;

    const responseChunks = await this.aiService.streamChat(userId, {
      messages: [prompt],
    });

    for await (const chunk of responseChunks) {
      const response: AiChatResponseDto = chunk;
      client.emit('chat_chunk', response);
    }

    client.emit('chat_end');
  }
}
