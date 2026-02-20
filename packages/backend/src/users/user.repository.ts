import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants.js';
import type { CreateUserInput, UserRow, UserWithPasswordRow } from './user.entity.js';

interface UserDatabaseRow extends Record<string, unknown> {
  id: string;
  email: string;
  display_name: string;
  created_at: Date;
  updated_at: Date;
}

interface UserWithPasswordDatabaseRow extends UserDatabaseRow {
  password_hash: string;
}

function isUserDatabaseRow(row: Record<string, unknown>): row is UserDatabaseRow {
  return (
    typeof row.id === 'string' &&
    typeof row.email === 'string' &&
    typeof row.display_name === 'string' &&
    row.created_at instanceof Date &&
    row.updated_at instanceof Date
  );
}

function isUserWithPasswordDatabaseRow(
  row: Record<string, unknown>,
): row is UserWithPasswordDatabaseRow {
  return isUserDatabaseRow(row) && typeof row.password_hash === 'string';
}

function toUserRow(row: Record<string, unknown>): UserRow {
  if (!isUserDatabaseRow(row)) {
    throw new Error('Unexpected user row shape from database');
  }

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toUserWithPasswordRow(row: Record<string, unknown>): UserWithPasswordRow {
  if (!isUserWithPasswordDatabaseRow(row)) {
    throw new Error('Unexpected user row shape from database');
  }

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    passwordHash: row.password_hash,
  };
}

@Injectable()
export class UserRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findById(id: string): Promise<UserRow | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT id, email, display_name, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];

    return row ? toUserRow(row) : undefined;
  }

  async findByEmail(email: string): Promise<UserRow | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT id, email, display_name, created_at, updated_at
       FROM users
       WHERE email = $1`,
      [email],
    );

    const row = result.rows[0];

    return row ? toUserRow(row) : undefined;
  }

  async findByEmailWithPassword(email: string): Promise<UserWithPasswordRow | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT id, email, display_name, password_hash, created_at, updated_at
       FROM users
       WHERE email = $1`,
      [email],
    );

    const row = result.rows[0];

    return row ? toUserWithPasswordRow(row) : undefined;
  }

  async create(input: CreateUserInput): Promise<UserRow> {
    const result = await this.pool.query<Record<string, unknown>>(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, display_name, created_at, updated_at`,
      [input.email, input.passwordHash, input.displayName],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error('Insert returned no rows');
    }

    return toUserRow(row);
  }
}
