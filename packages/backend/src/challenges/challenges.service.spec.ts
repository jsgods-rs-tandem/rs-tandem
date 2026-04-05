import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesRepository } from './challenges.repository.js';
import { ChallengesService } from './challenges.service.js';

const mockChallengesRepository = {
  findCategories: jest.fn(),
  findCategoryById: jest.fn(),
  findTopicById: jest.fn(),
  upsertTopicStatus: jest.fn(),
};

const categoryIdFixture = '11111111-1111-1111-1111-111111111111';
const topicIdFixture = '22222222-2222-2222-2222-222222222222';

describe('ChallengesService', () => {
  let service: ChallengesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        { provide: ChallengesRepository, useValue: mockChallengesRepository },
      ],
    }).compile();

    service = module.get(ChallengesService);
  });

  describe('getCategories', () => {
    it('delegates to findCategories and wraps result', async () => {
      const categoriesFixture = [{ id: categoryIdFixture, name: 'JavaScript Core' }];
      mockChallengesRepository.findCategories.mockResolvedValue(categoriesFixture);

      const result = await service.getCategories('u1', 'en');

      expect(mockChallengesRepository.findCategories).toHaveBeenCalledWith('u1', 'en');
      expect(result).toEqual({ categories: categoriesFixture });
    });
  });

  describe('getCategoryById', () => {
    it('returns repository result when found', async () => {
      const categoryFixture = { id: categoryIdFixture, name: 'JavaScript Core', topics: [] };
      mockChallengesRepository.findCategoryById.mockResolvedValue(categoryFixture);

      const result = await service.getCategoryById(categoryIdFixture, 'u1', 'en');

      expect(mockChallengesRepository.findCategoryById).toHaveBeenCalledWith(
        categoryIdFixture,
        'u1',
        'en',
      );
      expect(result).toBe(categoryFixture);
    });

    it('throws NotFoundException when category is missing', async () => {
      mockChallengesRepository.findCategoryById.mockResolvedValue(undefined);

      await expect(service.getCategoryById(categoryIdFixture, 'u1', 'en')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTopicById', () => {
    it('returns repository result when found', async () => {
      const topicFixture = {
        id: topicIdFixture,
        name: 'Array.prototype.map',
        status: 'notStarted',
      };
      mockChallengesRepository.findTopicById.mockResolvedValue(topicFixture);

      const result = await service.getTopicById(topicIdFixture, 'u1', 'ru');

      expect(mockChallengesRepository.findTopicById).toHaveBeenCalledWith(
        topicIdFixture,
        'u1',
        'ru',
      );
      expect(result).toBe(topicFixture);
    });

    it('throws NotFoundException when topic is missing', async () => {
      mockChallengesRepository.findTopicById.mockResolvedValue(undefined);

      await expect(service.getTopicById(topicIdFixture, 'u1', 'en')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTopicStatus', () => {
    it('returns repository result when status is updated', async () => {
      const responseFixture = { topicId: topicIdFixture, status: 'completed' };
      mockChallengesRepository.upsertTopicStatus.mockResolvedValue(responseFixture);

      const result = await service.updateTopicStatus('u1', topicIdFixture, {
        status: 'completed',
      });

      expect(mockChallengesRepository.upsertTopicStatus).toHaveBeenCalledWith(
        'u1',
        topicIdFixture,
        'completed',
      );
      expect(result).toBe(responseFixture);
    });

    it('throws NotFoundException when topic does not exist', async () => {
      mockChallengesRepository.upsertTopicStatus.mockResolvedValue(undefined);

      await expect(
        service.updateTopicStatus('u1', topicIdFixture, {
          status: 'inProgress',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
