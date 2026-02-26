import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProfilesService } from './profiles.service.js';
import { ProfileRepository } from './profile.repository.js';
import { UserRepository } from '../users/user.repository.js';

const now = new Date('2024-06-01T12:00:00.000Z');

const profileRow = {
  userId: 'u1',
  totalXp: 100,
  level: 2,
  problemsSolved: 5,
  currentStreak: 3,
  longestStreak: 7,
  lastSolvedAt: now,
  updatedAt: now,
};

const userRow = {
  id: 'u1',
  email: 'a@b.com',
  displayName: 'Alice',
  createdAt: now,
  updatedAt: now,
};

const expectedUserProfileDto = {
  userId: 'u1',
  displayName: 'Alice',
  email: 'a@b.com',
  totalXp: 100,
  level: 2,
  problemsSolved: 5,
  currentStreak: 3,
  longestStreak: 7,
  lastSolvedAt: now.toISOString(),
};

const expectedPublicProfileDto = {
  userId: 'u1',
  displayName: 'Alice',
  totalXp: 100,
  level: 2,
  problemsSolved: 5,
  currentStreak: 3,
};

const mockProfileRepository = {
  findByUserId: jest.fn(),
  create: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
};

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: ProfileRepository, useValue: mockProfileRepository },
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();
    service = module.get(ProfilesService);
  });

  describe('getProfile', () => {
    it('returns UserProfileDto when profile and user exist', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(profileRow);
      mockUserRepository.findById.mockResolvedValue(userRow);

      const result = await service.getProfile('u1');

      expect(result).toEqual(expectedUserProfileDto);
    });

    it('returns null lastSolvedAt as null', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue({
        ...profileRow,
        lastSolvedAt: null,
      });
      mockUserRepository.findById.mockResolvedValue(userRow);

      const result = await service.getProfile('u1');

      expect(result.lastSolvedAt).toBeNull();
    });

    it('throws NotFoundException when profile not found', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(undefined);
      mockUserRepository.findById.mockResolvedValue(userRow);

      await expect(service.getProfile('u1')).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when user not found', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(profileRow);
      mockUserRepository.findById.mockResolvedValue(undefined);

      await expect(service.getProfile('u1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPublicProfile', () => {
    it('returns PublicUserProfileDto when profile and user exist', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(profileRow);
      mockUserRepository.findById.mockResolvedValue(userRow);

      const result = await service.getPublicProfile('u1');

      expect(result).toEqual(expectedPublicProfileDto);
    });

    it('throws NotFoundException when profile not found', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(undefined);
      mockUserRepository.findById.mockResolvedValue(userRow);

      await expect(service.getPublicProfile('u1')).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when user not found', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(profileRow);
      mockUserRepository.findById.mockResolvedValue(undefined);

      await expect(service.getPublicProfile('u1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('updates displayName and returns full profile', async () => {
      const updatedUser = { ...userRow, displayName: 'Bob' };
      mockUserRepository.update.mockResolvedValue(updatedUser);
      mockProfileRepository.findByUserId.mockResolvedValue(profileRow);
      mockUserRepository.findById.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('u1', { displayName: 'Bob' });

      expect(mockUserRepository.update).toHaveBeenCalledWith('u1', { displayName: 'Bob' });
      expect(result.displayName).toBe('Bob');
    });

    it('updates email and returns full profile', async () => {
      const updatedUser = { ...userRow, email: 'new@b.com' };
      mockUserRepository.findByEmail.mockResolvedValue(undefined);
      mockUserRepository.update.mockResolvedValue(updatedUser);
      mockProfileRepository.findByUserId.mockResolvedValue(profileRow);
      mockUserRepository.findById.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('u1', { email: 'new@b.com' });

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('new@b.com');
      expect(mockUserRepository.update).toHaveBeenCalledWith('u1', { email: 'new@b.com' });
      expect(result.email).toBe('new@b.com');
    });

    it('allows updating email to your own current email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(userRow);
      mockUserRepository.update.mockResolvedValue(userRow);
      mockProfileRepository.findByUserId.mockResolvedValue(profileRow);
      mockUserRepository.findById.mockResolvedValue(userRow);

      const result = await service.updateProfile('u1', { email: 'a@b.com' });

      expect(result.email).toBe('a@b.com');
    });

    it('throws ConflictException when email is taken by another user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        ...userRow,
        id: 'other-user',
      });

      await expect(service.updateProfile('u1', { email: 'taken@b.com' })).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('skips email uniqueness check when email is not provided', async () => {
      mockUserRepository.update.mockResolvedValue(userRow);
      mockProfileRepository.findByUserId.mockResolvedValue(profileRow);
      mockUserRepository.findById.mockResolvedValue(userRow);

      await service.updateProfile('u1', { displayName: 'Bob' });

      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('handles empty dto as no-op and returns current profile', async () => {
      mockUserRepository.update.mockResolvedValue(userRow);
      mockProfileRepository.findByUserId.mockResolvedValue(profileRow);
      mockUserRepository.findById.mockResolvedValue(userRow);

      const result = await service.updateProfile('u1', {});

      expect(mockUserRepository.update).toHaveBeenCalledWith('u1', {});
      expect(result).toEqual(expectedUserProfileDto);
    });
  });

  describe('createProfile', () => {
    it('delegates to profileRepository.create', async () => {
      mockProfileRepository.create.mockResolvedValue(profileRow);

      const result = await service.createProfile('u1');

      expect(mockProfileRepository.create).toHaveBeenCalledWith({ userId: 'u1' });
      expect(result).toBe(profileRow);
    });
  });
});
