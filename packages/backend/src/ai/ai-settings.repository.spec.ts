import { Test, TestingModule } from '@nestjs/testing';
import { AiSettingsRepository } from './ai-settings.repository.js';
import { PG_POOL } from '../database/database.constants.js';

const mockPool = { query: jest.fn() };

const now = new Date('2024-06-01T12:00:00.000Z');

const validDatabaseRow = {
  user_id: 'u1',
  provider_id: 'ollama',
  api_key: null,
  created_at: now,
  updated_at: now,
};

const expectedRow = {
  userId: 'u1',
  providerId: 'ollama',
  apiKey: null,
  createdAt: now,
  updatedAt: now,
};

describe('AiSettingsRepository', () => {
  let repository: AiSettingsRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiSettingsRepository, { provide: PG_POOL, useValue: mockPool }],
    }).compile();
    repository = module.get(AiSettingsRepository);
  });

  describe('findByUserId', () => {
    it('returns mapped row when settings exist', async () => {
      mockPool.query.mockResolvedValue({ rows: [validDatabaseRow] });

      const result = await repository.findByUserId('u1');

      expect(result).toEqual(expectedRow);
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = $1'), [
        'u1',
      ]);
    });

    it('returns undefined when no rows returned', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await repository.findByUserId('u1');

      expect(result).toBeUndefined();
    });

    it('maps api_key correctly when present', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ ...validDatabaseRow, api_key: 'my-key' }],
      });

      const result = await repository.findByUserId('u1');

      expect(result?.apiKey).toBe('my-key');
    });
  });

  describe('upsert', () => {
    it('returns mapped row on success', async () => {
      mockPool.query.mockResolvedValue({ rows: [validDatabaseRow] });

      const result = await repository.upsert({
        userId: 'u1',
        providerId: 'ollama',
        apiKey: null,
        preserveExistingKey: false,
      });

      expect(result).toEqual(expectedRow);
    });

    it('passes all parameters to query in correct order', async () => {
      mockPool.query.mockResolvedValue({ rows: [validDatabaseRow] });

      await repository.upsert({
        userId: 'u1',
        providerId: 'ollama',
        apiKey: 'secret',
        preserveExistingKey: true,
      });

      expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
        'u1',
        'ollama',
        'secret',
        true,
      ]);
    });

    it('throws when upsert returns no rows', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      await expect(
        repository.upsert({
          userId: 'u1',
          providerId: 'ollama',
          apiKey: null,
          preserveExistingKey: false,
        }),
      ).rejects.toThrow('Upsert returned no rows');
    });
  });
});
