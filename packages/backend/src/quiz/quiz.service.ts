import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  GetCategoriesResponseDto,
  GetCategoryResponseDto,
  GetTopicResponseDto,
  GetResultsResponseDto,
  SubmitAnswerResponseDto,
  StartTopicResponseDto,
} from '@rs-tandem/shared';
import { QuizRepository } from './quiz.repository.js';
import type { SubmitAnswerDto } from './dto/submit-answer.dto.js';

@Injectable()
export class QuizService {
  constructor(private readonly quizRepository: QuizRepository) {}

  async getCategories(userId: string, lang: 'en' | 'ru'): Promise<GetCategoriesResponseDto> {
    const categories = await this.quizRepository.findAllCategories(userId, lang);

    return { categories };
  }

  async getCategoryById(
    id: string,
    userId: string,
    lang: 'en' | 'ru',
  ): Promise<GetCategoryResponseDto> {
    const category = await this.quizRepository.findCategoryById(id, userId, lang);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async getTopicById(id: string, userId: string, lang: 'en' | 'ru'): Promise<GetTopicResponseDto> {
    const [topic, latestAttempt] = await Promise.all([
      this.quizRepository.findTopicWithQuestions(id, lang),
      this.quizRepository.findLatestAttempt(userId, id),
    ]);

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const step = latestAttempt?.completedAt === null ? latestAttempt.currentStep : 0;

    return { ...topic, step };
  }

  async startTopic(id: string, userId: string): Promise<StartTopicResponseDto> {
    const [exists, latestAttempt] = await Promise.all([
      this.quizRepository.topicExists(id),
      this.quizRepository.findLatestAttempt(userId, id),
    ]);

    if (!exists) {
      throw new NotFoundException('Topic not found');
    }

    if (latestAttempt?.completedAt === null) {
      return { step: latestAttempt.currentStep };
    }

    await this.quizRepository.createAttempt(userId, id);

    return { step: 0 };
  }

  async submitAnswer(
    topicId: string,
    questionId: string,
    userId: string,
    lang: 'en' | 'ru',
    dto: SubmitAnswerDto,
  ): Promise<SubmitAnswerResponseDto> {
    const attempt = await this.quizRepository.findLatestAttempt(userId, topicId);

    if (attempt?.completedAt !== null) {
      throw new BadRequestException('No active quiz session');
    }

    let isCorrect: boolean;
    let explanation: string | null = null;

    if (dto.isTimeUp) {
      isCorrect = false;
      explanation = (await this.quizRepository.findQuestionExplanation(questionId, lang)) ?? null;
      await this.quizRepository.recordAndAdvanceAttempt(attempt.id, questionId, null, topicId);
    } else {
      const answer = await this.quizRepository.findAnswerById(dto.answerId);

      if (!answer) {
        throw new BadRequestException('Answer not found');
      }

      isCorrect = answer.isCorrect;

      if (!isCorrect) {
        explanation = (await this.quizRepository.findQuestionExplanation(questionId, lang)) ?? null;
      }

      await this.quizRepository.recordAndAdvanceAttempt(
        attempt.id,
        questionId,
        dto.answerId,
        topicId,
      );
    }

    return { isCorrect, explanation: isCorrect ? null : explanation };
  }

  async getResults(topicId: string, userId: string): Promise<GetResultsResponseDto> {
    const attempt = await this.quizRepository.findLatestCompletedAttempt(userId, topicId);

    if (!attempt) {
      throw new NotFoundException('No completed quiz found');
    }

    const [correct, total, links] = await Promise.all([
      this.quizRepository.countCorrectResponsesInAttempt(attempt.id),
      this.quizRepository.countQuestionsInTopic(topicId),
      this.quizRepository.findTopicLinks(topicId),
    ]);

    const score = total === 0 ? 0 : Math.round((correct / total) * 100);

    return { results: { score, links } };
  }
}
