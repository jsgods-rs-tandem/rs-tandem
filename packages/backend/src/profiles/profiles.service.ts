import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { PublicUserProfileDto, UpdateProfileDto, UserProfileDto } from '@rs-tandem/shared';
import { ProfileRepository } from './profile.repository.js';
import type { UserProfileRow } from './profile.entity.js';
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
      throw new NotFoundException('Profile not found');
    }

    return toUserProfileDto(profile, user.displayName, user.email);
  }

  async getPublicProfile(userId: string): Promise<PublicUserProfileDto> {
    const [profile, user] = await Promise.all([
      this.profileRepository.findByUserId(userId),
      this.userRepository.findById(userId),
    ]);

    if (!profile || !user) {
      throw new NotFoundException('Profile not found');
    }

    return toPublicUserProfileDto(profile, user.displayName);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfileDto> {
    if (dto.email) {
      const existing = await this.userRepository.findByEmail(dto.email);

      if (existing && existing.id !== userId) {
        throw new ConflictException('Email is already in use');
      }
    }

    await this.userRepository.update(userId, { ...dto });

    return this.getProfile(userId);
  }

  async createProfile(userId: string): Promise<UserProfileRow> {
    return this.profileRepository.create({ userId });
  }
}
