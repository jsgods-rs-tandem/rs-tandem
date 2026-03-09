import { Test, TestingModule } from '@nestjs/testing';
import type { UserDto } from '@rs-tandem/shared';
import { QuizController } from './quiz.controller.js';
import { QuizService } from './quiz.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SubmitAnswerDto } from './dto/submit-answer.dto.js';

const mockQuizService = {
  getCategories: jest.fn(),
  getCategoryById: jest.fn(),
  getTopicById: jest.fn(),
  startTopic: jest.fn(),
  submitAnswer: jest.fn(),
  getResults: jest.fn(),
};

const userFixture: UserDto = {
  id: 'u1',
  email: 'a@b.com',
  displayName: 'Alice',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const makeRequest = (lang?: string) =>
  ({
    headers: { 'accept-language': lang ?? 'ru' },
    user: userFixture,
  }) as unknown as Express.Request;

describe('QuizController', () => {
  let controller: QuizController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [{ provide: QuizService, useValue: mockQuizService }],
    }).compile();
    controller = module.get(QuizController);
  });

  // -------------------------------------------------------------------------
  describe('guards', () => {
    it('protects all routes via JwtAuthGuard at the class level', () => {
      const guards = Reflect.getMetadata('__guards__', QuizController) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
    });
  });

  // -------------------------------------------------------------------------
  describe('getCategories', () => {
    it('delegates to quizService.getCategories with userId and lang', async () => {
      const responseFixture = { categories: [] };
      mockQuizService.getCategories.mockResolvedValue(responseFixture);
      const request = makeRequest('ru');

      const result = await controller.getCategories(request);

      expect(mockQuizService.getCategories).toHaveBeenCalledWith('u1', 'ru');
      expect(result).toBe(responseFixture);
    });

    it("defaults lang to 'en' when Accept-Language header is absent", async () => {
      mockQuizService.getCategories.mockResolvedValue({ categories: [] });
      const request = { headers: {}, user: userFixture } as unknown as Express.Request;

      await controller.getCategories(request);

      expect(mockQuizService.getCategories).toHaveBeenCalledWith('u1', 'en');
    });
  });

  // -------------------------------------------------------------------------
  describe('getCategory', () => {
    it('delegates to quizService.getCategoryById with id, userId and lang', async () => {
      const responseFixture = { id: 'cat1', name: 'JS', topics: [] };
      mockQuizService.getCategoryById.mockResolvedValue(responseFixture);
      const request = makeRequest('en');

      const result = await controller.getCategory('cat1', request);

      expect(mockQuizService.getCategoryById).toHaveBeenCalledWith('cat1', 'u1', 'en');
      expect(result).toBe(responseFixture);
    });
  });

  // -------------------------------------------------------------------------
  describe('getTopic', () => {
    it('delegates to quizService.getTopicById with id, userId and lang', async () => {
      const responseFixture = { id: 'top1', name: 'Functions', step: 0 };
      mockQuizService.getTopicById.mockResolvedValue(responseFixture);
      const request = makeRequest('ru');

      const result = await controller.getTopic('top1', request);

      expect(mockQuizService.getTopicById).toHaveBeenCalledWith('top1', 'u1', 'ru');
      expect(result).toBe(responseFixture);
    });
  });

  // -------------------------------------------------------------------------
  describe('startTopic', () => {
    it('delegates to quizService.startTopic with id and userId', async () => {
      const responseFixture = { step: 0 };
      mockQuizService.startTopic.mockResolvedValue(responseFixture);
      const request = makeRequest('en');

      const result = await controller.startTopic('top1', request);

      expect(mockQuizService.startTopic).toHaveBeenCalledWith('top1', 'u1');
      expect(result).toBe(responseFixture);
    });
  });

  // -------------------------------------------------------------------------
  describe('submitAnswer', () => {
    it('delegates to quizService.submitAnswer with topicId, questionId, userId, lang and dto', async () => {
      const responseFixture = { isCorrect: true, explanation: null };
      mockQuizService.submitAnswer.mockResolvedValue(responseFixture);
      const request = makeRequest('en');
      const dto = { answerId: 'a1', isTimeUp: false } as SubmitAnswerDto;

      const result = await controller.submitAnswer('top1', 'q1', request, dto);

      expect(mockQuizService.submitAnswer).toHaveBeenCalledWith('top1', 'q1', 'u1', 'en', dto);
      expect(result).toBe(responseFixture);
    });
  });

  // -------------------------------------------------------------------------
  describe('getResults', () => {
    it('delegates to quizService.getResults with topicId and userId', async () => {
      const responseFixture = { results: { score: 80, links: [] } };
      mockQuizService.getResults.mockResolvedValue(responseFixture);
      const request = makeRequest('en');

      const result = await controller.getResults('top1', request);

      expect(mockQuizService.getResults).toHaveBeenCalledWith('top1', 'u1');
      expect(result).toBe(responseFixture);
    });
  });
});
