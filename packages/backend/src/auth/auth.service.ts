import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { AuthResponseDto, LoginDto, RegisterDto, UserDto } from '@rs-tandem/shared';
import { UserRepository } from '../users/user.repository.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmailWithPassword(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDto): Promise<UserDto> {
    const existing = await this.userRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const row = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      displayName: dto.displayName ?? '',
    });

    return {
      id: row.id,
      email: row.email,
      displayName: row.displayName,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
