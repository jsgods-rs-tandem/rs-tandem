import { Test, TestingModule } from '@nestjs/testing';
import type { AuthResponseDto, UserDto } from '@rs-tandem/shared';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { LoginDto, RegisterDto } from './dto/index.js';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

const userFixture: UserDto = {
  id: 'u1',
  email: 'a@b.com',
  displayName: 'Alice',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get(AuthController);
  });

  describe('register', () => {
    it('delegates to authService.register and returns UserDto', async () => {
      const dto = {
        email: 'a@b.com',
        password: 'password123',
        displayName: 'Alice',
      } as RegisterDto;
      mockAuthService.register.mockResolvedValue(userFixture);

      const result = await controller.register(dto);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result).toBe(userFixture);
    });
  });

  describe('login', () => {
    it('delegates to authService.login and returns AuthResponseDto', async () => {
      const dto = { email: 'a@b.com', password: 'password123' } as LoginDto;
      const response: AuthResponseDto = { accessToken: 'tok' };
      mockAuthService.login.mockResolvedValue(response);

      const result = await controller.login(dto);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(result).toBe(response);
    });
  });

  describe('me', () => {
    it('returns request.user', () => {
      const request = { user: userFixture } as unknown as Express.Request;

      const result = controller.me(request);

      expect(result).toBe(userFixture);
    });

    it('is protected by JwtAuthGuard', () => {
      const handler = Object.getOwnPropertyDescriptor(AuthController.prototype, 'me')
        ?.value as object;
      const guards = Reflect.getMetadata('__guards__', handler) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
    });
  });
});
