import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants.js';
import {
  DEFAULT_AVATAR_URL,
  type CreateUserProfileInput,
  type UpdateProfileInput,
  type UserProfileRow,
} from './profile.entity.js';

interface UserProfileDatabaseRow extends Record<string, unknown> {
  user_id: string;
  total_xp: number;
  level: number;
  problems_solved: number;
  current_streak: number;
  longest_streak: number;
  last_solved_at: Date | null;
  updated_at: Date;
  avatar_url: string | null;
  github_username: string | null;
}

function isUserProfileDatabaseRow(row: Record<string, unknown>): row is UserProfileDatabaseRow {
  return (
    typeof row.user_id === 'string' &&
    typeof row.total_xp === 'number' &&
    typeof row.level === 'number' &&
    typeof row.problems_solved === 'number' &&
    typeof row.current_streak === 'number' &&
    typeof row.longest_streak === 'number' &&
    (row.last_solved_at === null || row.last_solved_at instanceof Date) &&
    row.updated_at instanceof Date &&
    (row.avatar_url === null || typeof row.avatar_url === 'string') &&
    (row.github_username === null || typeof row.github_username === 'string')
  );
}

function toUserProfileRow(row: Record<string, unknown>): UserProfileRow {
  if (!isUserProfileDatabaseRow(row)) {
    throw new Error('Unexpected user profile row shape from database');
  }

  return {
    userId: row.user_id,
    totalXp: row.total_xp,
    level: row.level,
    problemsSolved: row.problems_solved,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    lastSolvedAt: row.last_solved_at,
    updatedAt: row.updated_at,
    avatarUrl: row.avatar_url,
    githubUsername: row.github_username,
  };
}

@Injectable()
export class ProfileRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findByUserId(userId: string): Promise<UserProfileRow | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT user_id, total_xp, level, problems_solved, current_streak, longest_streak, last_solved_at, updated_at, avatar_url, github_username
       FROM user_profiles
       WHERE user_id = $1`,
      [userId],
    );

    const row = result.rows[0];

    return row ? toUserProfileRow(row) : undefined;
  }

  async create(input: CreateUserProfileInput): Promise<UserProfileRow> {
    const defaultAvatar = DEFAULT_AVATAR_URL;
    const result = await this.pool.query<Record<string, unknown>>(
      `INSERT INTO user_profiles (user_id, avatar_url)
       VALUES ($1, $2)
       RETURNING user_id, total_xp, level, problems_solved, current_streak, longest_streak, last_solved_at, updated_at, avatar_url, github_username`,
      [input.userId, defaultAvatar],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error('Insert returned no rows');
    }

    return toUserProfileRow(row);
  }

  async update(userId: string, input: UpdateProfileInput): Promise<UserProfileRow> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let parameterIndex = 1;

    if (input.avatarUrl !== undefined) {
      setClauses.push(`avatar_url = $${String(parameterIndex)}`);
      values.push(input.avatarUrl);
      parameterIndex += 1;
    }

    if (input.githubUsername !== undefined) {
      setClauses.push(`github_username = $${String(parameterIndex)}`);
      values.push(input.githubUsername);
      parameterIndex += 1;
    }

    if (setClauses.length === 0) {
      const currentProfile = await this.findByUserId(userId);
      if (!currentProfile) {
        throw new Error('Profile not found');
      }
      return currentProfile;
    }

    setClauses.push('updated_at = NOW()');

    values.push(userId);

    const result = await this.pool.query<Record<string, unknown>>(
      `UPDATE user_profiles
       SET ${setClauses.join(', ')}
       WHERE user_id = $${String(parameterIndex)}
       RETURNING user_id, total_xp, level, problems_solved, current_streak, longest_streak, last_solved_at, updated_at, avatar_url, github_username`,
      values,
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error('Update returned no rows');
    }

    return toUserProfileRow(row);
  }
}
