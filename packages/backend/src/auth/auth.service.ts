import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

const BCRYPT_SALT_ROUNDS = 12;
import {
  type AuthResponseDto,
  type ChangePasswordDto,
  type LoginDto,
  type RegisterDto,
  type UserDto,
} from '@rs-tandem/shared';
import { UserRepository } from '../users/user.repository.js';
import { ProfilesService } from '../profiles/profiles.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly profilesService: ProfilesService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmailWithPassword(dto.email);

    if (!user) {
      throw new UnauthorizedException('auth.invalid_credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('auth.invalid_credentials');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new UnauthorizedException('auth.invalid_credentials');
    }

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('auth.invalid_credentials');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new ConflictException('auth.password_same_as_current');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_SALT_ROUNDS);

    await this.userRepository.updatePassword(userId, { passwordHash });
  }

  async register(dto: RegisterDto): Promise<UserDto> {
    const existing = await this.userRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('auth.email_exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
    const row = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      displayName: dto.displayName ?? '',
    });

    await this.profilesService.createProfile(row.id);

    return {
      id: row.id,
      email: row.email,
      displayName: row.displayName,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
