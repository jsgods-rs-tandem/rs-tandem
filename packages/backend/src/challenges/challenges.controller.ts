import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type {
  GetChallengeCategoriesResponseDto,
  GetChallengeCategoryResponseDto,
  GetChallengeTopicResponseDto,
  UpdateChallengeStatusResponseDto,
  UserDto,
} from '@rs-tandem/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ChallengesService } from './challenges.service.js';
import { resolveLang } from '../common/utils/resolve-lang.js';
import { UpdateChallengeStatusDto } from './dto/update-challenge-status.dto.js';

@Controller('challenges')
@UseGuards(JwtAuthGuard)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get('categories')
  getCategories(@Request() request: Express.Request): Promise<GetChallengeCategoriesResponseDto> {
    const user = request.user as UserDto;
    const lang = resolveLang(request.headers['accept-language']);

    return this.challengesService.getCategories(user.id, lang);
  }

  @Get('categories/:id')
  getCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() request: Express.Request,
  ): Promise<GetChallengeCategoryResponseDto> {
    const user = request.user as UserDto;
    const lang = resolveLang(request.headers['accept-language']);

    return this.challengesService.getCategoryById(id, user.id, lang);
  }

  @Get('topics/:id')
  getTopic(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() request: Express.Request,
  ): Promise<GetChallengeTopicResponseDto> {
    const user = request.user as UserDto;
    const lang = resolveLang(request.headers['accept-language']);

    return this.challengesService.getTopicById(id, user.id, lang);
  }

  @Post('topics/:id')
  updateTopicStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() request: Express.Request,
    @Body() dto: UpdateChallengeStatusDto,
  ): Promise<UpdateChallengeStatusResponseDto> {
    const user = request.user as UserDto;

    return this.challengesService.updateTopicStatus(user.id, id, dto);
  }
}
