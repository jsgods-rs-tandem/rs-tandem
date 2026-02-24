import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants.js';
import type { CreateUserProfileInput, UserProfileRow } from './profile.entity.js';

interface UserProfileDatabaseRow extends Record<string, unknown> {
  user_id: string;
  total_xp: number;
  level: number;
  problems_solved: number;
  current_streak: number;
  longest_streak: number;
  last_solved_at: Date | null;
  updated_at: Date;
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
    row.updated_at instanceof Date
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
  };
}

@Injectable()
export class ProfileRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findByUserId(userId: string): Promise<UserProfileRow | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT user_id, total_xp, level, problems_solved, current_streak, longest_streak, last_solved_at, updated_at
       FROM user_profiles
       WHERE user_id = $1`,
      [userId],
    );

    const row = result.rows[0];

    return row ? toUserProfileRow(row) : undefined;
  }

  async create(input: CreateUserProfileInput): Promise<UserProfileRow> {
    const result = await this.pool.query<Record<string, unknown>>(
      `INSERT INTO user_profiles (user_id)
       VALUES ($1)
       RETURNING user_id, total_xp, level, problems_solved, current_streak, longest_streak, last_solved_at, updated_at`,
      [input.userId],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error('Insert returned no rows');
    }

    return toUserProfileRow(row);
  }
}
