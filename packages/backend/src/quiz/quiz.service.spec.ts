import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QuizService } from './quiz.service.js';
import { QuizRepository } from './quiz.repository.js';

const mockQuizRepository = {
  findAllCategories: jest.fn(),
  findCategoryById: jest.fn(),
  findTopicWithQuestions: jest.fn(),
  topicExists: jest.fn(),
  findAnswerById: jest.fn(),
  findQuestionExplanation: jest.fn(),
  findLatestAttempt: jest.fn(),
  createAttempt: jest.fn(),
  recordAndAdvanceAttempt: jest.fn(),
  findLatestCompletedAttempt: jest.fn(),
  countCorrectResponsesInAttempt: jest.fn(),
  countQuestionsInTopic: jest.fn(),
  findTopicLinks: jest.fn(),
};

const now = new Date('2024-06-01T12:00:00.000Z');

const topicFixture = {
  id: 'top1',
  name: 'Functions',
  description: 'JS functions',
  category: 'Basic JavaScript',
  questionsCount: 3,
  questions: [
    { id: 'q1', name: 'What is closure?', codeSnippet: null, answers: [] },
    { id: 'q2', name: 'What is hoisting?', codeSnippet: null, answers: [] },
    { id: 'q3', name: 'What is scope?', codeSnippet: null, answers: [] },
  ],
};

const activeAttemptFixture = {
  id: 'att1',
  userId: 'u1',
  topicId: 'top1',
  currentStep: 1,
  completedAt: null,
  createdAt: now,
  updatedAt: now,
};

const completedAttemptFixture = {
  ...activeAttemptFixture,
  completedAt: now,
};

const newAttemptFixture = {
  id: 'att2',
  userId: 'u1',
  topicId: 'top1',
  currentStep: 0,
  completedAt: null,
  createdAt: now,
  updatedAt: now,
};

describe('QuizService', () => {
  let service: QuizService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizService, { provide: QuizRepository, useValue: mockQuizRepository }],
    }).compile();
    service = module.get(QuizService);
  });

  // -------------------------------------------------------------------------
  describe('getCategories', () => {
    it('delegates to findAllCategories and returns result', async () => {
      const categoriesFixture = [{ id: 'cat1', name: 'JS', topicsCount: 4 }];
      mockQuizRepository.findAllCategories.mockResolvedValue(categoriesFixture);

      const result = await service.getCategories('u1', 'en');

      expect(mockQuizRepository.findAllCategories).toHaveBeenCalledWith('u1', 'en');
      expect(result).toEqual({ categories: categoriesFixture });
    });
  });

  // -------------------------------------------------------------------------
  describe('getCategoryById', () => {
    it('returns result when repository finds the category', async () => {
      const categoryFixture = { id: 'cat1', name: 'JS', topics: [] };
      mockQuizRepository.findCategoryById.mockResolvedValue(categoryFixture);

      const result = await service.getCategoryById('cat1', 'u1', 'en');

      expect(mockQuizRepository.findCategoryById).toHaveBeenCalledWith('cat1', 'u1', 'en');
      expect(result).toBe(categoryFixture);
    });

    it('throws NotFoundException when repository returns undefined', async () => {
      mockQuizRepository.findCategoryById.mockResolvedValue(undefined);

      await expect(service.getCategoryById('cat1', 'u1', 'en')).rejects.toThrow(NotFoundException);
    });
  });

  // -------------------------------------------------------------------------
  describe('getTopicById', () => {
    it('throws NotFoundException when topic is not found', async () => {
      mockQuizRepository.findTopicWithQuestions.mockResolvedValue(undefined);

      await expect(service.getTopicById('top1', 'u1', 'en')).rejects.toThrow(NotFoundException);
    });

    it.each([
      ['no existing attempt', undefined],
      ['latest attempt is already completed', completedAttemptFixture],
    ])('returns step 0 without side effects when %s', async (_, latestAttempt) => {
      mockQuizRepository.findTopicWithQuestions.mockResolvedValue(topicFixture);
      mockQuizRepository.findLatestAttempt.mockResolvedValue(latestAttempt);

      const result = await service.getTopicById('top1', 'u1', 'en');

      expect(mockQuizRepository.createAttempt).not.toHaveBeenCalled();
      expect(result.step).toBe(0);
    });

    it('returns currentStep when active attempt exists', async () => {
      mockQuizRepository.findTopicWithQuestions.mockResolvedValue(topicFixture);
      mockQuizRepository.findLatestAttempt.mockResolvedValue(activeAttemptFixture);

      const result = await service.getTopicById('top1', 'u1', 'en');

      expect(mockQuizRepository.createAttempt).not.toHaveBeenCalled();
      expect(result.step).toBe(1);
    });
  });

  // -------------------------------------------------------------------------
  describe('startTopic', () => {
    it('throws NotFoundException when topic is not found', async () => {
      mockQuizRepository.topicExists.mockResolvedValue(false);
      mockQuizRepository.findLatestAttempt.mockResolvedValue(undefined);

      await expect(service.startTopic('top1', 'u1')).rejects.toThrow(NotFoundException);
    });

    it.each([
      ['no existing attempt', undefined],
      ['latest attempt is already completed', completedAttemptFixture],
    ])('creates a new attempt when %s', async (_, latestAttempt) => {
      mockQuizRepository.topicExists.mockResolvedValue(true);
      mockQuizRepository.findLatestAttempt.mockResolvedValue(latestAttempt);
      mockQuizRepository.createAttempt.mockResolvedValue(newAttemptFixture);

      const result = await service.startTopic('top1', 'u1');

      expect(mockQuizRepository.createAttempt).toHaveBeenCalledWith('u1', 'top1');
      expect(result.step).toBe(0);
    });

    it('reuses active attempt and returns its currentStep', async () => {
      mockQuizRepository.topicExists.mockResolvedValue(true);
      mockQuizRepository.findLatestAttempt.mockResolvedValue(activeAttemptFixture);

      const result = await service.startTopic('top1', 'u1');

      expect(mockQuizRepository.createAttempt).not.toHaveBeenCalled();
      expect(result.step).toBe(1);
    });
  });

  // -------------------------------------------------------------------------
  describe('submitAnswer', () => {
    it.each([
      ['no attempt exists', undefined],
      ['latest attempt is completed', completedAttemptFixture],
    ])('throws BadRequestException when %s', async (_, latestAttempt) => {
      mockQuizRepository.findLatestAttempt.mockResolvedValue(latestAttempt);

      await expect(
        service.submitAnswer('top1', 'q1', 'u1', 'en', { answerId: 'a1', isTimeUp: false }),
      ).rejects.toThrow(BadRequestException);
    });

    describe('isTimeUp path', () => {
      it('records null answerId, fetches explanation, and returns isCorrect false', async () => {
        mockQuizRepository.findLatestAttempt.mockResolvedValue(activeAttemptFixture);
        mockQuizRepository.findQuestionExplanation.mockResolvedValue('Time was up!');
        mockQuizRepository.recordAndAdvanceAttempt.mockResolvedValue({ completed: false });

        const result = await service.submitAnswer('top1', 'q1', 'u1', 'en', {
          answerId: '',
          isTimeUp: true,
        });

        expect(mockQuizRepository.recordAndAdvanceAttempt).toHaveBeenCalledWith(
          'att1',
          'q1',
          null,
          'top1',
        );
        expect(mockQuizRepository.findQuestionExplanation).toHaveBeenCalledWith('q1', 'en');
        expect(result).toEqual({ isCorrect: false, explanation: 'Time was up!' });
      });
    });

    describe('correct answer path', () => {
      it('does not fetch explanation and returns isCorrect true with null explanation', async () => {
        mockQuizRepository.findLatestAttempt.mockResolvedValue(activeAttemptFixture);
        mockQuizRepository.findAnswerById.mockResolvedValue({ isCorrect: true, questionId: 'q1' });
        mockQuizRepository.recordAndAdvanceAttempt.mockResolvedValue({ completed: false });

        const result = await service.submitAnswer('top1', 'q1', 'u1', 'en', {
          answerId: 'a1',
          isTimeUp: false,
        });

        expect(mockQuizRepository.findQuestionExplanation).not.toHaveBeenCalled();
        expect(mockQuizRepository.recordAndAdvanceAttempt).toHaveBeenCalledWith(
          'att1',
          'q1',
          'a1',
          'top1',
        );
        expect(result).toEqual({ isCorrect: true, explanation: null });
      });
    });

    describe('wrong answer path', () => {
      it('fetches explanation and returns it', async () => {
        mockQuizRepository.findLatestAttempt.mockResolvedValue(activeAttemptFixture);
        mockQuizRepository.findAnswerById.mockResolvedValue({ isCorrect: false, questionId: 'q1' });
        mockQuizRepository.findQuestionExplanation.mockResolvedValue('Wrong because...');
        mockQuizRepository.recordAndAdvanceAttempt.mockResolvedValue({ completed: false });

        const result = await service.submitAnswer('top1', 'q1', 'u1', 'en', {
          answerId: 'a2',
          isTimeUp: false,
        });

        expect(mockQuizRepository.findQuestionExplanation).toHaveBeenCalledWith('q1', 'en');
        expect(result).toEqual({ isCorrect: false, explanation: 'Wrong because...' });
      });
    });
  });

  // -------------------------------------------------------------------------
  describe('getResults', () => {
    it('throws NotFoundException when no completed attempt exists', async () => {
      mockQuizRepository.findLatestCompletedAttempt.mockResolvedValue(undefined);

      await expect(service.getResults('top1', 'u1')).rejects.toThrow(NotFoundException);
    });

    it('computes score as Math.round(correct / total * 100)', async () => {
      mockQuizRepository.findLatestCompletedAttempt.mockResolvedValue(completedAttemptFixture);
      mockQuizRepository.countCorrectResponsesInAttempt.mockResolvedValue(7);
      mockQuizRepository.countQuestionsInTopic.mockResolvedValue(10);
      mockQuizRepository.findTopicLinks.mockResolvedValue([]);

      const result = await service.getResults('top1', 'u1');

      expect(result.results.score).toBe(70);
    });

    it('returns score 100 when all questions answered correctly', async () => {
      mockQuizRepository.findLatestCompletedAttempt.mockResolvedValue(completedAttemptFixture);
      mockQuizRepository.countCorrectResponsesInAttempt.mockResolvedValue(5);
      mockQuizRepository.countQuestionsInTopic.mockResolvedValue(5);
      mockQuizRepository.findTopicLinks.mockResolvedValue([]);

      const result = await service.getResults('top1', 'u1');

      expect(result.results.score).toBe(100);
    });

    it('returns score 0 when no questions answered correctly', async () => {
      mockQuizRepository.findLatestCompletedAttempt.mockResolvedValue(completedAttemptFixture);
      mockQuizRepository.countCorrectResponsesInAttempt.mockResolvedValue(0);
      mockQuizRepository.countQuestionsInTopic.mockResolvedValue(5);
      mockQuizRepository.findTopicLinks.mockResolvedValue([]);

      const result = await service.getResults('top1', 'u1');

      expect(result.results.score).toBe(0);
    });

    it('includes links in the result', async () => {
      const links = ['https://example.com/js'];
      mockQuizRepository.findLatestCompletedAttempt.mockResolvedValue(completedAttemptFixture);
      mockQuizRepository.countCorrectResponsesInAttempt.mockResolvedValue(3);
      mockQuizRepository.countQuestionsInTopic.mockResolvedValue(5);
      mockQuizRepository.findTopicLinks.mockResolvedValue(links);

      const result = await service.getResults('top1', 'u1');

      expect(result.results.links).toEqual(links);
    });

    it('rounds fractional score', async () => {
      mockQuizRepository.findLatestCompletedAttempt.mockResolvedValue(completedAttemptFixture);
      mockQuizRepository.countCorrectResponsesInAttempt.mockResolvedValue(1);
      mockQuizRepository.countQuestionsInTopic.mockResolvedValue(3);
      mockQuizRepository.findTopicLinks.mockResolvedValue([]);

      const result = await service.getResults('top1', 'u1');

      expect(result.results.score).toBe(Math.round((1 / 3) * 100));
    });
  });
});
