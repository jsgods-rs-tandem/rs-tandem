import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository.js';
import { PG_POOL } from '../database/database.constants.js';

const mockPool = {
  query: jest.fn(),
};

const now = new Date('2024-06-01T12:00:00.000Z');

const validDatabaseRow = {
  id: 'u1',
  email: 'a@b.com',
  display_name: 'Alice',
  created_at: now,
  updated_at: now,
};

const validDatabaseRowWithPassword = {
  ...validDatabaseRow,
  password_hash: 'hashed_pw',
};

const expectedUserRow = {
  id: 'u1',
  email: 'a@b.com',
  displayName: 'Alice',
  createdAt: now,
  updatedAt: now,
};

const expectedUserWithPasswordRow = {
  ...expectedUserRow,
  passwordHash: 'hashed_pw',
};

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, { provide: PG_POOL, useValue: mockPool }],
    }).compile();
    repository = module.get(UserRepository);
  });

  describe('findById', () => {
    it('returns mapped UserRow when user exists', async () => {
      mockPool.query.mockResolvedValue({ rows: [validDatabaseRow] });

      const result = await repository.findById('u1');

      expect(result).toEqual(expectedUserRow);
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id = $1'), ['u1']);
    });

    it('returns undefined when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findById('missing');

      expect(result).toBeUndefined();
    });

    it('throws when db row has unexpected shape', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ id: 123, email: 'a@b.com' }] });

      await expect(repository.findById('u1')).rejects.toThrow(
        'Unexpected user row shape from database',
      );
    });
  });

  describe('findByEmail', () => {
    it('returns mapped UserRow when user exists', async () => {
      mockPool.query.mockResolvedValue({ rows: [validDatabaseRow] });

      const result = await repository.findByEmail('a@b.com');

      expect(result).toEqual(expectedUserRow);
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE email = $1'), [
        'a@b.com',
      ]);
    });

    it('returns undefined when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findByEmail('missing@b.com');

      expect(result).toBeUndefined();
    });

    it('throws when db row has unexpected shape', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ id: 'u1', email: 42 }] });

      await expect(repository.findByEmail('a@b.com')).rejects.toThrow(
        'Unexpected user row shape from database',
      );
    });
  });

  describe('findByEmailWithPassword', () => {
    it('returns mapped UserWithPasswordRow when user exists', async () => {
      mockPool.query.mockResolvedValue({ rows: [validDatabaseRowWithPassword] });

      const result = await repository.findByEmailWithPassword('a@b.com');

      expect(result).toEqual(expectedUserWithPasswordRow);
    });

    it('returns undefined when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findByEmailWithPassword('missing@b.com');

      expect(result).toBeUndefined();
    });

    it('throws when password_hash is missing from row', async () => {
      mockPool.query.mockResolvedValue({ rows: [validDatabaseRow] });

      await expect(repository.findByEmailWithPassword('a@b.com')).rejects.toThrow(
        'Unexpected user row shape from database',
      );
    });

    it('throws when password_hash is not a string', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ ...validDatabaseRow, password_hash: 12_345 }],
      });

      await expect(repository.findByEmailWithPassword('a@b.com')).rejects.toThrow(
        'Unexpected user row shape from database',
      );
    });
  });

  describe('create', () => {
    it('returns mapped UserRow on successful insert', async () => {
      mockPool.query.mockResolvedValue({ rows: [validDatabaseRow] });

      const result = await repository.create({
        email: 'a@b.com',
        passwordHash: 'hashed_pw',
        displayName: 'Alice',
      });

      expect(result).toEqual(expectedUserRow);
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'), [
        'a@b.com',
        'hashed_pw',
        'Alice',
      ]);
    });

    it('throws when insert returns no rows', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      await expect(
        repository.create({ email: 'a@b.com', passwordHash: 'h', displayName: 'A' }),
      ).rejects.toThrow('Insert returned no rows');
    });

    it('throws when returned row has unexpected shape', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ id: 'u1' }] });

      await expect(
        repository.create({ email: 'a@b.com', passwordHash: 'h', displayName: 'A' }),
      ).rejects.toThrow('Unexpected user row shape from database');
    });
  });
});
