import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service.js';
import { UserRepository } from '../users/user.repository.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { UsersService } from '../users/users.service.js';

jest.mock('bcryptjs');

const mockUserRepository = {
  findByEmailWithPassword: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  describe('login', () => {
    it('returns accessToken on valid credentials', async () => {
      mockUserRepository.findByEmailWithPassword.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        passwordHash: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('tok');

      const result = await service.login({ email: 'a@b.com', password: 'pw' });

      expect(result).toEqual({ accessToken: 'tok' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 'u1', email: 'a@b.com' });
    });

    it('throws UnauthorizedException when email not found', async () => {
      mockUserRepository.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.login({ email: 'x@y.com', password: 'pw' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when password does not match', async () => {
      mockUserRepository.findByEmailWithPassword.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        passwordHash: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: 'a@b.com', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    const now = new Date('2024-01-01T00:00:00.000Z');

    it('creates user with hashed password and returns UserDto with ISO dates', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pw');
      mockUserRepository.create.mockResolvedValue({
        id: 'u2',
        email: 'new@b.com',
        displayName: 'Alice',
        createdAt: now,
        updatedAt: now,
      });

      const result = await service.register({
        email: 'new@b.com',
        password: 'secret',
        displayName: 'Alice',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 12);
      expect(result).toEqual({
        id: 'u2',
        email: 'new@b.com',
        displayName: 'Alice',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    });

    it('throws ConflictException when email already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: 'u1', email: 'taken@b.com' });

      await expect(service.register({ email: 'taken@b.com', password: 'pw' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('defaults displayName to empty string when not provided', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pw');
      mockUserRepository.create.mockResolvedValue({
        id: 'u3',
        email: 'nodisplay@b.com',
        displayName: '',
        createdAt: now,
        updatedAt: now,
      });

      await service.register({ email: 'nodisplay@b.com', password: 'pw' });

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ displayName: '' }),
      );
    });
  });
});

describe('JwtStrategy.validate', () => {
  const mockUsersService = { findById: jest.fn() };
  const mockConfigService = { getOrThrow: jest.fn().mockReturnValue('test-secret') };
  let strategy: JwtStrategy;

  beforeEach(() => {
    jest.clearAllMocks();
    strategy = new JwtStrategy(
      mockConfigService as unknown as ConfigService,
      mockUsersService as unknown as UsersService,
    );
  });

  it('returns UserDto when user found', async () => {
    const user = {
      id: 'u1',
      email: 'a@b.com',
      displayName: 'Alice',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    mockUsersService.findById.mockResolvedValue(user);

    const result = await strategy.validate({ sub: 'u1', email: 'a@b.com' });

    expect(result).toBe(user);
    expect(mockUsersService.findById).toHaveBeenCalledWith('u1');
  });

  it('throws UnauthorizedException when user not found', async () => {
    mockUsersService.findById.mockResolvedValue(undefined);

    await expect(strategy.validate({ sub: 'missing', email: 'x@y.com' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
