import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {
  type PublicUserProfileDto,
  type UpdateProfileDto,
  type UserProfileDto,
} from '@rs-tandem/shared';
import { ProfileRepository } from './profile.repository.js';
import { type UpdateProfileInput, type UserProfileRow } from './profile.entity.js';
import { UserRepository } from '../users/user.repository.js';

function toPublicUserProfileDto(
  profile: UserProfileRow,
  displayName: string,
): PublicUserProfileDto {
  return {
    userId: profile.userId,
    displayName,
    totalXp: profile.totalXp,
    level: profile.level,
    problemsSolved: profile.problemsSolved,
    currentStreak: profile.currentStreak,
    avatarUrl: profile.avatarUrl,
    githubUsername: profile.githubUsername,
  };
}

function toUserProfileDto(
  profile: UserProfileRow,
  displayName: string,
  email: string,
): UserProfileDto {
  return {
    ...toPublicUserProfileDto(profile, displayName),
    email,
    longestStreak: profile.longestStreak,
    lastSolvedAt: profile.lastSolvedAt ? profile.lastSolvedAt.toISOString() : null,
  };
}

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getProfile(userId: string): Promise<UserProfileDto> {
    const [profile, user] = await Promise.all([
      this.profileRepository.findByUserId(userId),
      this.userRepository.findById(userId),
    ]);

    if (!profile || !user) {
      throw new NotFoundException('profile.not_found');
    }

    return toUserProfileDto(profile, user.displayName, user.email);
  }

  async getPublicProfile(userId: string): Promise<PublicUserProfileDto> {
    const [profile, user] = await Promise.all([
      this.profileRepository.findByUserId(userId),
      this.userRepository.findById(userId),
    ]);

    if (!profile || !user) {
      throw new NotFoundException('profile.not_found');
    }

    return toPublicUserProfileDto(profile, user.displayName);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfileDto> {
    if (dto.email) {
      const existing = await this.userRepository.findByEmail(dto.email);

      if (existing && existing.id !== userId) {
        throw new ConflictException('profile.email_in_use');
      }
    }

    if (dto.email || dto.displayName) {
      const userUpdate: { email?: string; displayName?: string } = {};

      if (dto.email) userUpdate.email = dto.email;
      if (dto.displayName) userUpdate.displayName = dto.displayName;

      await this.userRepository.update(userId, userUpdate);
    }

    if (dto.avatarUrl !== undefined || dto.githubUsername !== undefined) {
      const profileUpdate: UpdateProfileInput = {};

      if (dto.avatarUrl !== undefined) profileUpdate.avatarUrl = dto.avatarUrl;
      if (dto.githubUsername !== undefined) profileUpdate.githubUsername = dto.githubUsername;

      await this.profileRepository.update(userId, profileUpdate);
    }

    return this.getProfile(userId);
  }

  async createProfile(userId: string): Promise<UserProfileRow> {
    return this.profileRepository.create({ userId });
  }
}
