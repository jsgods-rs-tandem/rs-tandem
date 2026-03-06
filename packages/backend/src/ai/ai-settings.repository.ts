import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants.js';
import type { UserAiSettingsRow } from './ai-settings.entity.js';

function toUserAiSettingsRow(row: Record<string, unknown>): UserAiSettingsRow {
  return {
    userId: row.user_id as string,
    providerId: row.provider_id as string,
    apiKey: row.api_key as string | null,
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
  };
}

export interface UpsertAiSettingsInput {
  userId: string;
  providerId: string;
  apiKey: string | null;
  preserveExistingKey: boolean;
}

@Injectable()
export class AiSettingsRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findByUserId(userId: string): Promise<UserAiSettingsRow | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT user_id, provider_id, api_key, created_at, updated_at
       FROM user_ai_settings
       WHERE user_id = $1`,
      [userId],
    );

    const row = result.rows[0];

    return row ? toUserAiSettingsRow(row) : undefined;
  }

  async upsert(input: UpsertAiSettingsInput): Promise<UserAiSettingsRow> {
    const result = await this.pool.query<Record<string, unknown>>(
      `INSERT INTO user_ai_settings (user_id, provider_id, api_key)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET
         provider_id = EXCLUDED.provider_id,
         api_key = CASE WHEN $4 THEN user_ai_settings.api_key ELSE EXCLUDED.api_key END,
         updated_at = NOW()
       RETURNING user_id, provider_id, api_key, created_at, updated_at`,
      [input.userId, input.providerId, input.apiKey, input.preserveExistingKey],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error('Upsert returned no rows');
    }

    return toUserAiSettingsRow(row);
  }
}
