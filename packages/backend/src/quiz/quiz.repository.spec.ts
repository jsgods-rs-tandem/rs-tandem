import { Test, TestingModule } from '@nestjs/testing';
import { QuizRepository } from './quiz.repository.js';
import { PG_POOL } from '../database/database.constants.js';

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

const mockPool = { query: jest.fn(), connect: jest.fn() };

const now = new Date('2024-06-01T12:00:00.000Z');

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const validCategoryRow = {
  id: 'cat1',
  name: 'Basic JavaScript',
  description: 'JS fundamentals',
  topics_count: 4,
  topics_complete_count: 1,
  progress: 0.25,
};

const validTopicSummaryRow = {
  id: 'top1',
  name: 'Functions',
  description: 'JS functions',
  questions_count: 10,
  score: 80,
  in_progress: false,
};

const validTopicAggRow = {
  topic_id: 'top1',
  topic_name: 'Functions',
  topic_description: 'JS functions',
  category: 'Basic JavaScript',
  questions_count: 1,
  questions: [
    {
      id: 'q1',
      name: 'What is a closure?',
      codeSnippet: null,
      answers: [{ id: 'a1', text: 'An inner function' }],
    },
  ],
};

const validAttemptRow = {
  id: 'att1',
  user_id: 'u1',
  topic_id: 'top1',
  current_step: 0,
  completed_at: null,
  created_at: now,
  updated_at: now,
};

const validAnswerCheckRow = {
  is_correct: true,
  question_id: 'q1',
};

// ---------------------------------------------------------------------------

describe('QuizRepository', () => {
  let repository: QuizRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPool.connect.mockResolvedValue(mockClient);
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizRepository, { provide: PG_POOL, useValue: mockPool }],
    }).compile();
    repository = module.get(QuizRepository);
  });

  // -------------------------------------------------------------------------
  describe('findAllCategories', () => {
    it('returns mapped categories when rows are present', async () => {
      mockPool.query.mockResolvedValue({ rows: [validCategoryRow] });

      const result = await repository.findAllCategories('u1', 'en');

      expect(result).toEqual([
        {
          id: 'cat1',
          name: 'Basic JavaScript',
          description: 'JS fundamentals',
          topicsCount: 4,
          topicsCompleteCount: 1,
          progress: 0.25,
        },
      ]);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['u1', 'en']),
      );
    });

    it('returns empty array when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findAllCategories('u1', 'en');

      expect(result).toEqual([]);
    });

    it('throws on invalid row shape', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ ...validCategoryRow, topics_complete_count: undefined }],
      });

      await expect(repository.findAllCategories('u1', 'en')).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  describe('findCategoryById', () => {
    it('returns mapped category when found', async () => {
      mockPool.query.mockResolvedValue({ rows: [validTopicSummaryRow] });

      const result = await repository.findCategoryById('cat1', 'u1', 'en');

      expect(result).toBeDefined();
    });

    it('returns undefined when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findCategoryById('cat1', 'u1', 'en');

      expect(result).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  describe('findTopicWithQuestions', () => {
    it('returns topic with questions from aggregated row', async () => {
      mockPool.query.mockResolvedValue({ rows: [validTopicAggRow] });

      const result = await repository.findTopicWithQuestions('top1', 'en');

      expect(result?.questions).toHaveLength(1);
      expect(result?.questions[0]?.answers).toHaveLength(1);
    });

    it('returns topic with multiple questions', async () => {
      const rowWithMultipleQuestions = {
        ...validTopicAggRow,
        questions_count: 2,
        questions: [
          { id: 'q1', name: 'What is a closure?', codeSnippet: null, answers: [] },
          { id: 'q2', name: 'What is hoisting?', codeSnippet: null, answers: [] },
        ],
      };
      mockPool.query.mockResolvedValue({ rows: [rowWithMultipleQuestions] });

      const result = await repository.findTopicWithQuestions('top1', 'en');

      expect(result?.questions).toHaveLength(2);
    });

    it('omits is_correct from answer objects', async () => {
      mockPool.query.mockResolvedValue({ rows: [validTopicAggRow] });

      const result = await repository.findTopicWithQuestions('top1', 'en');

      const answer = result?.questions[0]?.answers[0];
      expect(answer).not.toHaveProperty('isCorrect');
      expect(answer).not.toHaveProperty('is_correct');
    });

    it('returns undefined when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findTopicWithQuestions('top1', 'en');

      expect(result).toBeUndefined();
    });

    it('maps code_snippet as null when absent', async () => {
      mockPool.query.mockResolvedValue({ rows: [validTopicAggRow] });

      const result = await repository.findTopicWithQuestions('top1', 'en');

      expect(result?.questions[0]?.codeSnippet).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  describe('findAnswerById', () => {
    it('maps row to isCorrect and questionId', async () => {
      mockPool.query.mockResolvedValue({ rows: [validAnswerCheckRow] });

      const result = await repository.findAnswerById('a1');

      expect(result).toEqual({ isCorrect: true, questionId: 'q1' });
    });

    it('returns undefined when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findAnswerById('a1');

      expect(result).toBeUndefined();
    });

    it('throws on invalid row shape', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ is_correct: 'yes', question_id: 'q1' }],
      });

      await expect(repository.findAnswerById('a1')).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  describe('findQuestionExplanation', () => {
    it('returns explanation string when found', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ explanation: 'Because closures...' }] });

      const result = await repository.findQuestionExplanation('q1', 'en');

      expect(result).toBe('Because closures...');
    });

    it('returns null when explanation column is null', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ explanation: null }] });

      const result = await repository.findQuestionExplanation('q1', 'en');

      expect(result).toBeNull();
    });

    it('returns undefined when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findQuestionExplanation('q1', 'en');

      expect(result).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  describe('topicExists', () => {
    it('returns true when a row is found', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ '?column?': 1 }] });

      const result = await repository.topicExists('top1');

      expect(result).toBe(true);
    });

    it('returns false when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.topicExists('top1');

      expect(result).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  describe('findLatestAttempt', () => {
    it('maps row to camelCase attempt with completedAt null', async () => {
      mockPool.query.mockResolvedValue({ rows: [validAttemptRow] });

      const result = await repository.findLatestAttempt('u1', 'top1');

      expect(result).toEqual({
        id: 'att1',
        userId: 'u1',
        topicId: 'top1',
        currentStep: 0,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('maps completedAt as Date when DB column is a Date', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ ...validAttemptRow, completed_at: now }],
      });

      const result = await repository.findLatestAttempt('u1', 'top1');

      expect(result?.completedAt).toEqual(now);
    });

    it('returns undefined when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findLatestAttempt('u1', 'top1');

      expect(result).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  describe('createAttempt', () => {
    it('calls INSERT and returns mapped attempt row', async () => {
      mockPool.query.mockResolvedValue({ rows: [validAttemptRow] });

      const result = await repository.createAttempt('u1', 'top1');

      expect(result).toMatchObject({ id: 'att1', userId: 'u1', topicId: 'top1', currentStep: 0 });
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT'),
        expect.arrayContaining(['u1', 'top1']),
      );
    });
  });

  // -------------------------------------------------------------------------
  describe('recordAndAdvanceAttempt', () => {
    it('executes a transaction and returns completed false when not the last step', async () => {
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [{ current_step: 0 }] }) // SELECT FOR UPDATE
        .mockResolvedValueOnce(undefined) // INSERT response
        .mockResolvedValueOnce({ rows: [{ count: '3' }] }) // COUNT questions
        .mockResolvedValueOnce(undefined) // UPDATE advance step
        .mockResolvedValueOnce(undefined); // COMMIT

      const result = await repository.recordAndAdvanceAttempt('att1', 'q1', 'a1', 'top1');

      expect(result).toEqual({ completed: false });
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('completes the attempt when last step is reached', async () => {
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [{ current_step: 2 }] }) // SELECT FOR UPDATE (step 2)
        .mockResolvedValueOnce(undefined) // INSERT response
        .mockResolvedValueOnce({ rows: [{ count: '3' }] }) // COUNT (total 3)
        .mockResolvedValueOnce(undefined) // UPDATE completed_at
        .mockResolvedValueOnce(undefined); // COMMIT

      const result = await repository.recordAndAdvanceAttempt('att1', 'q1', 'a1', 'top1');

      expect(result).toEqual({ completed: true });
    });

    it('rolls back and releases client on error', async () => {
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(new Error('DB error')); // SELECT FOR UPDATE fails

      await expect(
        repository.recordAndAdvanceAttempt('att1', 'q1', 'a1', 'top1'),
      ).rejects.toThrow();

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('passes null answerId when time is up', async () => {
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [{ current_step: 0 }] }) // SELECT FOR UPDATE
        .mockResolvedValueOnce(undefined) // INSERT response
        .mockResolvedValueOnce({ rows: [{ count: '3' }] }) // COUNT
        .mockResolvedValueOnce(undefined) // UPDATE
        .mockResolvedValueOnce(undefined); // COMMIT

      await repository.recordAndAdvanceAttempt('att1', 'q1', null, 'top1');

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT'),
        expect.arrayContaining([null]),
      );
    });
  });

  // -------------------------------------------------------------------------
  describe('findLatestCompletedAttempt', () => {
    it('returns mapped attempt when found', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ ...validAttemptRow, completed_at: now }],
      });

      const result = await repository.findLatestCompletedAttempt('u1', 'top1');

      expect(result?.completedAt).toEqual(now);
    });

    it('returns undefined when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findLatestCompletedAttempt('u1', 'top1');

      expect(result).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  describe('countCorrectResponsesInAttempt', () => {
    it('returns integer count of correct responses', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ count: '7' }] });

      const result = await repository.countCorrectResponsesInAttempt('att1');

      expect(result).toBe(7);
    });
  });

  // -------------------------------------------------------------------------
  describe('countQuestionsInTopic', () => {
    it('returns integer count', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ count: '15' }] });

      const result = await repository.countQuestionsInTopic('top1');

      expect(result).toBe(15);
    });
  });

  // -------------------------------------------------------------------------
  describe('findTopicLinks', () => {
    it('returns string array of links', async () => {
      const links = ['https://example.com/1', 'https://example.com/2'];
      mockPool.query.mockResolvedValue({ rows: [{ links }] });

      const result = await repository.findTopicLinks('top1');

      expect(result).toEqual(links);
    });

    it('returns empty array when topic has no links', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ links: [] }] });

      const result = await repository.findTopicLinks('top1');

      expect(result).toEqual([]);
    });
  });
});
