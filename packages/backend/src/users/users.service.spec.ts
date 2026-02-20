import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { UserRepository } from './user.repository.js';

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
};

const now = new Date('2024-06-01T12:00:00.000Z');
const userRow = {
  id: 'u1',
  email: 'a@b.com',
  displayName: 'Alice',
  createdAt: now,
  updatedAt: now,
};
const expectedDto = {
  id: 'u1',
  email: 'a@b.com',
  displayName: 'Alice',
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: UserRepository, useValue: mockUserRepository }],
    }).compile();
    service = module.get(UsersService);
  });

  describe('findById', () => {
    it('returns UserDto with ISO string dates when user exists', async () => {
      mockUserRepository.findById.mockResolvedValue(userRow);

      const result = await service.findById('u1');

      expect(result).toEqual(expectedDto);
    });

    it('returns undefined when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await service.findById('missing');

      expect(result).toBeUndefined();
    });
  });

  describe('findByEmail', () => {
    it('returns UserDto with ISO string dates when user exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(userRow);

      const result = await service.findByEmail('a@b.com');

      expect(result).toEqual(expectedDto);
    });

    it('returns undefined when user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('x@y.com');

      expect(result).toBeUndefined();
    });
  });
});
