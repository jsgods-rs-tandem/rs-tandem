import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AiService } from './ai.service.js';
import { HttpException, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt-auth.guard.js';
import type { AiChatResponseDto, AiMessage, UserDto, UserMessageDto } from 'packages/shared';
import AppError from '../common/utils/app-error.js';
import { AiErrorDto } from 'packages/shared/src/ai.js';
import { title } from './errors/errors.js';

export interface SocketData {
  user: UserDto;
}

interface ClientToServerEvents {
  chat: (message: UserMessageDto) => void;
}

interface ServerToClientEvents {
  chat_chunk: (chunk: string) => void;
  chat_end: () => void;
  error: (error: AiErrorDto) => void;
}

type AuthenticatedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

@WebSocketGateway()
export class AiGateway {
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

    try {
      const responseChunks = this.aiService.streamChat(userId, prompt);

      for await (const chunk of responseChunks) {
        const response: AiChatResponseDto = chunk;
        client.emit('chat_chunk', response);
      }

      client.emit('chat_end');
    } catch (error) {
      if (error instanceof HttpException) {
        throw new WsException(error);
      }
      if (error instanceof AppError) {
        const errorMessage: AiErrorDto = {
          type: 'provider_error',
          title: title[error.code],
          message: error.message,
          status: error.status,
        };
        client.emit('error', errorMessage);
      }

      console.error(error);
      throw new WsException(`Unknown error`);
    }
  }
}
