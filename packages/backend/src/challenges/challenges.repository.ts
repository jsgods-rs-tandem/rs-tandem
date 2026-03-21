import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants.js';
import type {
  ChallengeSummary,
  ChallengeTopicSummary,
  GetChallengeCategoryResponseDto,
} from '@rs-tandem/shared';

interface ChallengeCategoryRow extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  topics_count: number;
  topics_complete_count: number;
  progress: number;
}

interface ChallengeCategoryBasicRow extends Record<string, unknown> {
  id: string;
  name: string;
}

interface ChallengeTopicRow extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  tags: string[];
  in_progress: boolean;
  is_complete: boolean;
}

function isCategoryRow(row: Record<string, unknown>): row is ChallengeCategoryRow {
  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.description === 'string' &&
    typeof row.topics_count === 'number' &&
    typeof row.topics_complete_count === 'number' &&
    typeof row.progress === 'number'
  );
}

function isCategoryBasicRow(row: Record<string, unknown>): row is ChallengeCategoryBasicRow {
  return typeof row.id === 'string' && typeof row.name === 'string';
}

function isTopicRow(row: Record<string, unknown>): row is ChallengeTopicRow {
  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.description === 'string' &&
    typeof row.difficulty === 'string' &&
    Array.isArray(row.tags) &&
    typeof row.in_progress === 'boolean' &&
    typeof row.is_complete === 'boolean'
  );
}

function toCategorySummary(row: Record<string, unknown>): ChallengeSummary {
  if (!isCategoryRow(row)) {
    throw new Error('Unexpected challenge category row shape from database');
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    topicsCount: row.topics_count,
    topicsCompleteCount: row.topics_complete_count,
    progress: row.progress,
  };
}

function toTopicSummary(row: Record<string, unknown>): ChallengeTopicSummary {
  if (!isTopicRow(row)) {
    throw new Error('Unexpected challenge topic row shape from database');
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    difficulty: row.difficulty as ChallengeTopicSummary['difficulty'],
    tags: row.tags,
    inProgress: row.in_progress,
    isComplete: row.is_complete,
  };
}

@Injectable()
export class ChallengesRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findCategories(userId: string, lang: 'en' | 'ru'): Promise<ChallengeSummary[]> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT
         cc.id,
         CASE WHEN $2 = 'en' THEN cc.name_en ELSE cc.name_ru END AS name,
         CASE WHEN $2 = 'en' THEN cc.description_en ELSE cc.description_ru END AS description,
         COUNT(ct.id)::INT AS topics_count,
         COUNT(ucp.id) FILTER (WHERE ucp.status = 'completed')::INT AS topics_complete_count,
         CASE
           WHEN COUNT(ct.id) = 0 THEN 0
           ELSE ROUND(
             COUNT(ucp.id) FILTER (WHERE ucp.status = 'completed')::FLOAT / COUNT(ct.id) * 100
           )::INT
         END AS progress
       FROM challenge_categories cc
       LEFT JOIN challenge_topics ct ON ct.category_id = cc.id
       LEFT JOIN user_challenge_progress ucp ON ucp.topic_id = ct.id AND ucp.user_id = $1
       GROUP BY cc.id, cc.name_en, cc.name_ru, cc.description_en, cc.description_ru
       ORDER BY cc.created_at`,
      [userId, lang],
    );

    return result.rows.map((row) => toCategorySummary(row));
  }

  async findCategoryById(
    categoryId: string,
    userId: string,
    lang: 'en' | 'ru',
  ): Promise<GetChallengeCategoryResponseDto | undefined> {
    const catResult = await this.pool.query<Record<string, unknown>>(
      `SELECT
         id,
         CASE WHEN $2 = 'en' THEN name_en ELSE name_ru END AS name
       FROM challenge_categories
       WHERE id = $1`,
      [categoryId, lang],
    );

    const catRow = catResult.rows[0];

    if (!catRow) return undefined;

    if (!isCategoryBasicRow(catRow)) {
      throw new Error('Unexpected challenge category row shape from database');
    }

    const topicsResult = await this.pool.query<Record<string, unknown>>(
      `SELECT
         ct.id,
         CASE WHEN $3 = 'en' THEN ct.name_en ELSE ct.name_ru END AS name,
         CASE WHEN $3 = 'en' THEN ct.description_en ELSE ct.description_ru END AS description,
         ct.difficulty,
         COALESCE(
           ARRAY(
             SELECT tg.name
             FROM challenge_topic_tags ctt
             JOIN challenge_tags tg ON tg.id = ctt.tag_id
             WHERE ctt.topic_id = ct.id
             ORDER BY tg.name
           ),
           '{}'::TEXT[]
         ) AS tags,
         (ucp.status = 'in_progress') AS in_progress,
         (ucp.status = 'completed') AS is_complete
       FROM challenge_topics ct
       LEFT JOIN user_challenge_progress ucp ON ucp.topic_id = ct.id AND ucp.user_id = $2
       WHERE ct.category_id = $1
       ORDER BY ct.sort_order, ct.created_at`,
      [categoryId, userId, lang],
    );

    const topics = topicsResult.rows.map((row) => toTopicSummary(row));
    const topicsCount = topics.length;
    const topicsCompleteCount = topics.filter((topic) => topic.isComplete).length;
    const progress = topicsCount === 0 ? 0 : Math.round((topicsCompleteCount / topicsCount) * 100);

    return {
      id: catRow.id,
      categoryName: catRow.name,
      topicsCount,
      topicsCompleteCount,
      progress,
      topics,
    };
  }
}
