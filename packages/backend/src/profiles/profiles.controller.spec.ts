import { Test, TestingModule } from '@nestjs/testing';
import type { UserDto, UserProfileDto, PublicUserProfileDto } from '@rs-tandem/shared';
import { ProfilesController } from './profiles.controller.js';
import { ProfilesService } from './profiles.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UpdateProfileDto } from './dto/index.js';

const mockProfilesService = {
  getProfile: jest.fn(),
  getPublicProfile: jest.fn(),
  updateProfile: jest.fn(),
};

const userFixture: UserDto = {
  id: 'u1',
  email: 'a@b.com',
  displayName: 'Alice',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const profileFixture: UserProfileDto = {
  userId: 'u1',
  displayName: 'Alice',
  email: 'a@b.com',
  totalXp: 100,
  level: 2,
  problemsSolved: 5,
  currentStreak: 3,
  longestStreak: 7,
  lastSolvedAt: '2024-06-01T12:00:00.000Z',
};

const publicProfileFixture: PublicUserProfileDto = {
  userId: 'u1',
  displayName: 'Alice',
  totalXp: 100,
  level: 2,
  problemsSolved: 5,
  currentStreak: 3,
};

describe('ProfilesController', () => {
  let controller: ProfilesController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [{ provide: ProfilesService, useValue: mockProfilesService }],
    }).compile();

    controller = module.get(ProfilesController);
  });

  describe('getMyProfile', () => {
    it('delegates to profilesService.getProfile with user id', async () => {
      const request = { user: userFixture } as unknown as Express.Request;
      mockProfilesService.getProfile.mockResolvedValue(profileFixture);

      const result = await controller.getMyProfile(request);

      expect(mockProfilesService.getProfile).toHaveBeenCalledWith('u1');
      expect(result).toBe(profileFixture);
    });

    it('is protected by JwtAuthGuard', () => {
      const handler = Object.getOwnPropertyDescriptor(ProfilesController.prototype, 'getMyProfile')
        ?.value as object;
      const guards = Reflect.getMetadata('__guards__', handler) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
    });
  });

  describe('updateMyProfile', () => {
    it('delegates to profilesService.updateProfile with user id and dto', async () => {
      const request = { user: userFixture } as unknown as Express.Request;
      const dto = { displayName: 'Bob' } as UpdateProfileDto;
      mockProfilesService.updateProfile.mockResolvedValue({
        ...profileFixture,
        displayName: 'Bob',
      });

      const result = await controller.updateMyProfile(request, dto);

      expect(mockProfilesService.updateProfile).toHaveBeenCalledWith('u1', dto);
      expect(result.displayName).toBe('Bob');
    });

    it('is protected by JwtAuthGuard', () => {
      const handler = Object.getOwnPropertyDescriptor(
        ProfilesController.prototype,
        'updateMyProfile',
      )?.value as object;
      const guards = Reflect.getMetadata('__guards__', handler) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
    });
  });

  describe('getPublicProfile', () => {
    it('delegates to profilesService.getPublicProfile with id param', async () => {
      mockProfilesService.getPublicProfile.mockResolvedValue(publicProfileFixture);

      const result = await controller.getPublicProfile('u1');

      expect(mockProfilesService.getPublicProfile).toHaveBeenCalledWith('u1');
      expect(result).toBe(publicProfileFixture);
    });

    it('is not protected by JwtAuthGuard', () => {
      const handler = Object.getOwnPropertyDescriptor(
        ProfilesController.prototype,
        'getPublicProfile',
      )?.value as object;
      const guards = (Reflect.getMetadata('__guards__', handler) ?? []) as unknown[];

      expect(guards).not.toContain(JwtAuthGuard);
    });
  });
});
