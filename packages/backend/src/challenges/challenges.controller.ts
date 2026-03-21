import { Controller, Get, Param, ParseUUIDPipe, Request, UseGuards } from '@nestjs/common';
import type {
  GetChallengesResponseDto,
  GetChallengeCategoryResponseDto,
  UserDto,
} from '@rs-tandem/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ChallengesService } from './challenges.service.js';
import { resolveLang } from '../common/utils/resolve-lang.js';

@Controller('challenges')
@UseGuards(JwtAuthGuard)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get('categories')
  getCategories(@Request() request: Express.Request): Promise<GetChallengesResponseDto> {
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
}
