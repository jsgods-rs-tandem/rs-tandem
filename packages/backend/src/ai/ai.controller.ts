import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import type { AiChatResponseDto, AiProviderDto, AiSettingsDto, UserDto } from '@rs-tandem/shared';
import { AiService } from './ai.service.js';
import { UpdateAiSettingsDto } from './dto/update-ai-settings.dto.js';
import { AiChatDto } from './dto/ai-chat.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AiThrottlerGuard } from './guards/ai-throttler.guard.js';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('providers')
  getProviders(): AiProviderDto[] {
    return this.aiService.getProviders();
  }

  @UseGuards(JwtAuthGuard)
  @Get('settings/me')
  getMySettings(@Request() request: Express.Request): Promise<AiSettingsDto> {
    const user = request.user as UserDto;

    return this.aiService.getMySettings(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('settings/me')
  updateMySettings(
    @Request() request: Express.Request,
    @Body() dto: UpdateAiSettingsDto,
  ): Promise<AiSettingsDto> {
    const user = request.user as UserDto;

    return this.aiService.updateMySettings(user.id, dto);
  }

  @UseGuards(JwtAuthGuard, AiThrottlerGuard)
  @Post('chat')
  chat(@Request() request: Express.Request, @Body() dto: AiChatDto): Promise<AiChatResponseDto> {
    const user = request.user as UserDto;

    return this.aiService.chat(user.id, dto);
  }
}
