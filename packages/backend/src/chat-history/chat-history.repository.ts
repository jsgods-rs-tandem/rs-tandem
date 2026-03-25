import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants.js';
import { ChatHistoryRow } from './chat-history.entity.js';

interface UpsertChatHistoryInput {
  role: string;
  content: string;
  userId: string;
}

interface ChatHistoryDatabaseRow extends Record<string, unknown> {
  id: number;
  role: string;
  content: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

function isChatHistoryDatabaseRow(row: Record<string, unknown>): row is ChatHistoryDatabaseRow {
  return (
    typeof row.id === 'number' &&
    typeof row.role === 'string' &&
    typeof row.content === 'string' &&
    typeof row.user_id === 'string' &&
    row.created_at instanceof Date &&
    row.updated_at instanceof Date
  );
}

function toChatHistoryRow(row: Record<string, unknown>): ChatHistoryRow {
  if (!isChatHistoryDatabaseRow(row)) {
    throw new Error('Unexpected chat history row shape from database');
  }
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

@Injectable()
export class ChatHistoryRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findByUserIdSortedByUpdatedAt(userId: string): Promise<ChatHistoryRow[]> {
    const result = await this.pool.query<Record<string, unknown>>(
      `
      SELECT *
      FROM user_chat_history
      WHERE user_id = $1
      ORDER BY updated_at ASC
      `,
      [userId],
    );
    return result.rows.map((element) => toChatHistoryRow(element));
  }

  async upsert(input: UpsertChatHistoryInput): Promise<ChatHistoryRow> {
    const result = await this.pool.query<Record<string, unknown>>(
      `
        INSERT INTO user_chat_history (role, content, user_id, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *;
      `,
      [input.role, input.content, input.userId],
    );
    const row = result.rows[0];
    if (!row) {
      throw new Error('Upsert returned no rows');
    }
    return toChatHistoryRow(row);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.pool.query<Record<string, unknown>>(
      `
        DELETE FROM user_chat_history
        WHERE user_id = $1;
      `,
      [userId],
    );
  }
}
