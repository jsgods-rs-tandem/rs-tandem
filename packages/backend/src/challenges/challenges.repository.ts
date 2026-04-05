import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants.js';
import type {
  ChallengeCategorySummary,
  ChallengeStatus,
  ChallengeTopicSummary,
  GetChallengeCategoryResponseDto,
  GetChallengeTopicResponseDto,
  UpdateChallengeStatusResponseDto,
} from '@rs-tandem/shared';

interface ChallengeCategoryRow extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  topics_count: number;
  topics_complete_count: number;
  progress: number;
}

interface ChallengeCategoryDetailsRow extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
}

interface ChallengeTopicRow extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  tags: LocalizedTextRow[];
  status: string;
}

interface ChallengeTopicDetailsRow extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  instructions: string;
  category_id: string;
  difficulty: string;
  tags: LocalizedTextRow[];
  status: string;
  function_name: string;
  starter_code: string;
  builtin_fns: Record<string, string> | null;
  test_cases: RawChallengeTestCase[];
}

interface LocalizedTextRow {
  en: string;
  ru: string;
}

interface RawChallengeTestCase {
  id: number;
  description: LocalizedTextRow;
  args: unknown[];
  expected: unknown;
}

interface UpdateChallengeStatusRow extends Record<string, unknown> {
  topic_id: string;
  status: string;
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

function isCategoryDetailsRow(row: Record<string, unknown>): row is ChallengeCategoryDetailsRow {
  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.description === 'string'
  );
}

function isTopicRow(row: Record<string, unknown>): row is ChallengeTopicRow {
  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.description === 'string' &&
    typeof row.difficulty === 'string' &&
    isLocalizedTextArray(row.tags) &&
    typeof row.status === 'string'
  );
}

function isLocalizedText(value: unknown): value is LocalizedTextRow {
  const candidate = value as Record<string, unknown>;

  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    typeof candidate.en === 'string' &&
    typeof candidate.ru === 'string'
  );
}

function isLocalizedTextArray(value: unknown): value is LocalizedTextRow[] {
  return Array.isArray(value) && value.every((entry) => isLocalizedText(entry));
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((entry) => typeof entry === 'string')
  );
}

function isChallengeTestCase(value: unknown): value is RawChallengeTestCase {
  const candidate = value as Record<string, unknown>;

  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    typeof candidate.id === 'number' &&
    isLocalizedText(candidate.description) &&
    Array.isArray(candidate.args) &&
    'expected' in candidate
  );
}

function isTopicDetailsRow(row: Record<string, unknown>): row is ChallengeTopicDetailsRow {
  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.description === 'string' &&
    typeof row.instructions === 'string' &&
    typeof row.category_id === 'string' &&
    typeof row.difficulty === 'string' &&
    isLocalizedTextArray(row.tags) &&
    typeof row.status === 'string' &&
    typeof row.function_name === 'string' &&
    typeof row.starter_code === 'string' &&
    (row.builtin_fns === null || isStringRecord(row.builtin_fns)) &&
    Array.isArray(row.test_cases) &&
    row.test_cases.every((entry) => isChallengeTestCase(entry))
  );
}

function isUpdateStatusRow(row: Record<string, unknown>): row is UpdateChallengeStatusRow {
  return typeof row.topic_id === 'string' && typeof row.status === 'string';
}

function isChallengeStatus(status: string): status is ChallengeStatus {
  return status === 'notStarted' || status === 'inProgress' || status === 'completed';
}

function resolveLocalizedText(value: LocalizedTextRow, lang: 'en' | 'ru'): string {
  return lang === 'ru' ? value.ru : value.en;
}

function toCategorySummary(row: Record<string, unknown>): ChallengeCategorySummary {
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

function toTopicSummary(row: Record<string, unknown>, lang: 'en' | 'ru'): ChallengeTopicSummary {
  if (!isTopicRow(row)) {
    throw new Error('Unexpected challenge topic row shape from database');
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    difficulty: row.difficulty as ChallengeTopicSummary['difficulty'],
    tags: row.tags.map((tag) => resolveLocalizedText(tag, lang)),
    status: isChallengeStatus(row.status) ? row.status : 'notStarted',
  };
}

function toTopicDetails(
  row: Record<string, unknown>,
  lang: 'en' | 'ru',
): GetChallengeTopicResponseDto {
  if (!isTopicDetailsRow(row)) {
    throw new Error('Unexpected challenge topic details row shape from database');
  }

  const baseTopic: GetChallengeTopicResponseDto = {
    id: row.id,
    name: row.name,
    description: row.description,
    instructions: row.instructions,
    categoryId: row.category_id,
    difficulty: row.difficulty as GetChallengeTopicResponseDto['difficulty'],
    tags: row.tags.map((tag) => resolveLocalizedText(tag, lang)),
    status: isChallengeStatus(row.status) ? row.status : 'notStarted',
    functionName: row.function_name,
    starterCode: row.starter_code,
    testCases: row.test_cases.map((testCase) => ({
      id: testCase.id,
      description: resolveLocalizedText(testCase.description, lang),
      args: testCase.args,
      expected: testCase.expected,
    })),
  };

  return row.builtin_fns ? { ...baseTopic, builtinFns: row.builtin_fns } : baseTopic;
}

function toUpdatedStatus(row: Record<string, unknown>): UpdateChallengeStatusResponseDto {
  if (!isUpdateStatusRow(row)) {
    throw new Error('Unexpected challenge progress row shape from database');
  }

  return {
    topicId: row.topic_id,
    status: isChallengeStatus(row.status) ? row.status : 'notStarted',
  };
}

@Injectable()
export class ChallengesRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findCategories(userId: string, lang: 'en' | 'ru'): Promise<ChallengeCategorySummary[]> {
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
       GROUP BY cc.id, cc.name_en, cc.name_ru, cc.description_en, cc.description_ru, cc.sort_order, cc.created_at
       ORDER BY cc.sort_order, cc.created_at`,
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
         CASE WHEN $2 = 'en' THEN name_en ELSE name_ru END AS name,
         CASE WHEN $2 = 'en' THEN description_en ELSE description_ru END AS description
       FROM challenge_categories
       WHERE id = $1`,
      [categoryId, lang],
    );

    const catRow = catResult.rows[0];

    if (!catRow) return undefined;

    if (!isCategoryDetailsRow(catRow)) {
      throw new Error('Unexpected challenge category row shape from database');
    }

    const topicsResult = await this.pool.query<Record<string, unknown>>(
      `SELECT
         ct.id,
         CASE WHEN $3 = 'en' THEN ct.name_en ELSE ct.name_ru END AS name,
         CASE WHEN $3 = 'en' THEN ct.description_en ELSE ct.description_ru END AS description,
         ct.difficulty,
         ct.tags,
         COALESCE(ucp.status, 'notStarted') AS status
       FROM challenge_topics ct
       LEFT JOIN user_challenge_progress ucp ON ucp.topic_id = ct.id AND ucp.user_id = $2
       WHERE ct.category_id = $1
       ORDER BY ct.sort_order, ct.created_at`,
      [categoryId, userId, lang],
    );

    const topics = topicsResult.rows.map((row) => toTopicSummary(row, lang));
    const topicsCount = topics.length;
    const topicsCompleteCount = topics.filter((topic) => topic.status === 'completed').length;
    const progress = topicsCount === 0 ? 0 : Math.round((topicsCompleteCount / topicsCount) * 100);

    return {
      id: catRow.id,
      name: catRow.name,
      description: catRow.description,
      topicsCount,
      topicsCompleteCount,
      progress,
      topics,
    };
  }

  async findTopicById(
    id: string,
    userId: string,
    lang: 'en' | 'ru',
  ): Promise<GetChallengeTopicResponseDto | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT
         ct.id,
         CASE WHEN $2 = 'en' THEN ct.name_en ELSE ct.name_ru END AS name,
         CASE WHEN $2 = 'en' THEN ct.description_en ELSE ct.description_ru END AS description,
         CASE WHEN $2 = 'en' THEN ct.instructions_en ELSE ct.instructions_ru END AS instructions,
         ct.category_id,
         ct.difficulty,
         ct.tags,
         COALESCE(ucp.status, 'notStarted') AS status,
         ct.function_name,
         ct.starter_code,
         ct.builtin_fns,
         ct.test_cases
       FROM challenge_topics ct
       LEFT JOIN user_challenge_progress ucp ON ucp.topic_id = ct.id AND ucp.user_id = $3
       WHERE ct.id = $1`,
      [id, lang, userId],
    );

    const row = result.rows[0];

    return row ? toTopicDetails(row, lang) : undefined;
  }

  async upsertTopicStatus(
    userId: string,
    topicId: string,
    status: 'inProgress' | 'completed',
  ): Promise<UpdateChallengeStatusResponseDto | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `WITH existing_topic AS (
         SELECT id
         FROM challenge_topics
         WHERE id = $2
       )
       INSERT INTO user_challenge_progress (user_id, topic_id, status, started_at, completed_at)
       SELECT
         $1,
         existing_topic.id,
         $3,
         NOW(),
         CASE WHEN $3 = 'completed' THEN NOW() ELSE NULL END
       FROM existing_topic
       ON CONFLICT (user_id, topic_id) DO UPDATE
       SET
         status = EXCLUDED.status,
         started_at = COALESCE(user_challenge_progress.started_at, NOW()),
         completed_at = CASE
           WHEN EXCLUDED.status = 'completed' THEN COALESCE(user_challenge_progress.completed_at, NOW())
           ELSE NULL
         END
       RETURNING topic_id, status`,
      [userId, topicId, status],
    );

    const row = result.rows[0];

    return row ? toUpdatedStatus(row) : undefined;
  }
}
