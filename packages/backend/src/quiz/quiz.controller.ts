import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import type {
  GetCategoriesResponseDto,
  GetCategoryResponseDto,
  GetTopicResponseDto,
  GetResultsResponseDto,
  SubmitAnswerResponseDto,
  StartTopicResponseDto,
  UserDto,
} from '@rs-tandem/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { QuizService } from './quiz.service.js';
import { SubmitAnswerDto } from './dto/submit-answer.dto.js';
import { resolveLang } from '../common/utils/resolve-lang.js';

@Controller('quiz')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('categories')
  getCategories(@Request() request: Express.Request): Promise<GetCategoriesResponseDto> {
    const user = request.user as UserDto;
    const lang = resolveLang(request.headers['accept-language']);

    return this.quizService.getCategories(user.id, lang);
  }

  @Get('categories/:id')
  getCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() request: Express.Request,
  ): Promise<GetCategoryResponseDto> {
    const user = request.user as UserDto;
    const lang = resolveLang(request.headers['accept-language']);

    return this.quizService.getCategoryById(id, user.id, lang);
  }

  @Get('topics/:id')
  getTopic(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() request: Express.Request,
  ): Promise<GetTopicResponseDto> {
    const user = request.user as UserDto;
    const lang = resolveLang(request.headers['accept-language']);

    return this.quizService.getTopicById(id, user.id, lang);
  }

  @Post('topics/:id/start')
  startTopic(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() request: Express.Request,
  ): Promise<StartTopicResponseDto> {
    const user = request.user as UserDto;

    return this.quizService.startTopic(id, user.id);
  }

  @Put('topics/:topicId/questions/:questionId')
  submitAnswer(
    @Param('topicId', ParseUUIDPipe) topicId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Request() request: Express.Request,
    @Body() dto: SubmitAnswerDto,
  ): Promise<SubmitAnswerResponseDto> {
    const user = request.user as UserDto;
    const lang = resolveLang(request.headers['accept-language']);

    return this.quizService.submitAnswer(topicId, questionId, user.id, lang, dto);
  }

  @Get('results/:topicId')
  getResults(
    @Param('topicId', ParseUUIDPipe) topicId: string,
    @Request() request: Express.Request,
  ): Promise<GetResultsResponseDto> {
    const user = request.user as UserDto;

    return this.quizService.getResults(topicId, user.id);
  }
}
