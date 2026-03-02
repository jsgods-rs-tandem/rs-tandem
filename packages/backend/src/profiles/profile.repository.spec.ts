import { Test, TestingModule } from '@nestjs/testing';
import { ProfileRepository } from './profile.repository.js';
import { PG_POOL } from '../database/database.constants.js';

const mockPool = {
  query: jest.fn(),
};

const now = new Date('2024-06-01T12:00:00.000Z');

const validDatabaseRow = {
  user_id: 'u1',
  total_xp: 100,
  level: 2,
  problems_solved: 5,
  current_streak: 3,
  longest_streak: 7,
  last_solved_at: now,
  updated_at: now,
};

const expectedProfileRow = {
  userId: 'u1',
  totalXp: 100,
  level: 2,
  problemsSolved: 5,
  currentStreak: 3,
  longestStreak: 7,
  lastSolvedAt: now,
  updatedAt: now,
};

describe('ProfileRepository', () => {
  let repository: ProfileRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileRepository, { provide: PG_POOL, useValue: mockPool }],
    }).compile();
    repository = module.get(ProfileRepository);
  });

  describe('findByUserId', () => {
    it('returns mapped UserProfileRow when profile exists', async () => {
      mockPool.query.mockResolvedValue({ rows: [validDatabaseRow] });

      const result = await repository.findByUserId('u1');

      expect(result).toEqual(expectedProfileRow);
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = $1'), [
        'u1',
      ]);
    });

    it('returns undefined when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findByUserId('missing');

      expect(result).toBeUndefined();
    });

    it('maps null last_solved_at correctly', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ ...validDatabaseRow, last_solved_at: null }],
      });

      const result = await repository.findByUserId('u1');

      expect(result).toEqual({ ...expectedProfileRow, lastSolvedAt: null });
    });

    it('throws when db row has unexpected shape', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ user_id: 123 }] });

      await expect(repository.findByUserId('u1')).rejects.toThrow(
        'Unexpected user profile row shape from database',
      );
    });
  });

  describe('create', () => {
    it('returns mapped UserProfileRow on successful insert', async () => {
      mockPool.query.mockResolvedValue({ rows: [validDatabaseRow] });

      const result = await repository.create({ userId: 'u1' });

      expect(result).toEqual(expectedProfileRow);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_profiles'),
        ['u1'],
      );
    });

    it('throws when insert returns no rows', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      await expect(repository.create({ userId: 'u1' })).rejects.toThrow('Insert returned no rows');
    });

    it('throws when returned row has unexpected shape', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ user_id: 'u1' }] });

      await expect(repository.create({ userId: 'u1' })).rejects.toThrow(
        'Unexpected user profile row shape from database',
      );
    });
  });
});
