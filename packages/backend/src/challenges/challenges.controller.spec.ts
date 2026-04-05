import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '@rs-tandem/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ChallengesController } from './challenges.controller.js';
import { ChallengesService } from './challenges.service.js';
import { UpdateChallengeStatusDto } from './dto/update-challenge-status.dto.js';

const mockChallengesService = {
  getCategories: jest.fn(),
  getCategoryById: jest.fn(),
  getTopicById: jest.fn(),
  updateTopicStatus: jest.fn(),
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

const categoryIdFixture = '11111111-1111-1111-1111-111111111111';
const topicIdFixture = '22222222-2222-2222-2222-222222222222';

describe('ChallengesController', () => {
  let controller: ChallengesController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengesController],
      providers: [{ provide: ChallengesService, useValue: mockChallengesService }],
    }).compile();
    controller = module.get(ChallengesController);
  });

  describe('guards', () => {
    it('protects all routes via JwtAuthGuard at the class level', () => {
      const guards = Reflect.getMetadata('__guards__', ChallengesController) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
    });
  });

  describe('getCategories', () => {
    it('delegates to challengesService.getCategories with userId and lang', async () => {
      const responseFixture = { categories: [] };
      mockChallengesService.getCategories.mockResolvedValue(responseFixture);
      const request = makeRequest('ru');

      const result = await controller.getCategories(request);

      expect(mockChallengesService.getCategories).toHaveBeenCalledWith('u1', 'ru');
      expect(result).toBe(responseFixture);
    });

    it("defaults lang to 'en' when Accept-Language header is absent", async () => {
      mockChallengesService.getCategories.mockResolvedValue({ categories: [] });
      const request = { headers: {}, user: userFixture } as unknown as Express.Request;

      await controller.getCategories(request);

      expect(mockChallengesService.getCategories).toHaveBeenCalledWith('u1', 'en');
    });
  });

  describe('getCategory', () => {
    it('delegates to challengesService.getCategoryById with id, userId and lang', async () => {
      const responseFixture = { id: categoryIdFixture, name: 'JavaScript Core', topics: [] };
      mockChallengesService.getCategoryById.mockResolvedValue(responseFixture);
      const request = makeRequest('en');

      const result = await controller.getCategory(categoryIdFixture, request);

      expect(mockChallengesService.getCategoryById).toHaveBeenCalledWith(
        categoryIdFixture,
        'u1',
        'en',
      );
      expect(result).toBe(responseFixture);
    });
  });

  describe('getTopic', () => {
    it('delegates to challengesService.getTopicById with id, userId and lang', async () => {
      const responseFixture = {
        id: topicIdFixture,
        name: 'Array.prototype.map',
        status: 'notStarted',
      };
      mockChallengesService.getTopicById.mockResolvedValue(responseFixture);
      const request = makeRequest('ru');

      const result = await controller.getTopic(topicIdFixture, request);

      expect(mockChallengesService.getTopicById).toHaveBeenCalledWith(topicIdFixture, 'u1', 'ru');
      expect(result).toBe(responseFixture);
    });
  });

  describe('updateTopicStatus', () => {
    it('delegates to challengesService.updateTopicStatus with userId, id and dto', async () => {
      const responseFixture = { topicId: topicIdFixture, status: 'completed' };
      mockChallengesService.updateTopicStatus.mockResolvedValue(responseFixture);
      const request = makeRequest('en');
      const dto = { status: 'completed' } as UpdateChallengeStatusDto;

      const result = await controller.updateTopicStatus(topicIdFixture, request, dto);

      expect(mockChallengesService.updateTopicStatus).toHaveBeenCalledWith(
        'u1',
        topicIdFixture,
        dto,
      );
      expect(result).toBe(responseFixture);
    });
  });
});
