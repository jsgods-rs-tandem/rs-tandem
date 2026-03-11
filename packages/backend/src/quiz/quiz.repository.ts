import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants.js';
import type {
  GetCategoryResponseDto,
  QuizCategorySummary,
  QuizTopicSummary,
  QuizQuestion,
} from '@rs-tandem/shared';

interface QuizCategoryRow extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  topics_count: number;
  topics_complete_count: number;
  progress: number;
}

interface QuizCategoryBasicRow extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
}

interface QuizTopicSummaryRow extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  questions_count: number;
  score: number | null;
  in_progress: boolean;
}

interface TopicAggRow extends Record<string, unknown> {
  topic_id: string;
  topic_name: string;
  topic_description: string;
  category: string;
  questions_count: number;
  questions: QuizQuestion[];
}

interface AnswerValidationRow extends Record<string, unknown> {
  is_correct: boolean;
  question_id: string;
}

interface AttemptDatabaseRow extends Record<string, unknown> {
  id: string;
  user_id: string;
  topic_id: string;
  current_step: number;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AttemptData {
  id: string;
  userId: string;
  topicId: string;
  currentStep: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

function isCategoryRow(row: Record<string, unknown>): row is QuizCategoryRow {
  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.description === 'string' &&
    typeof row.topics_count === 'number' &&
    typeof row.topics_complete_count === 'number' &&
    typeof row.progress === 'number'
  );
}

function isCategoryBasicRow(row: Record<string, unknown>): row is QuizCategoryBasicRow {
  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.description === 'string'
  );
}

function isTopicSummaryRow(row: Record<string, unknown>): row is QuizTopicSummaryRow {
  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.description === 'string' &&
    typeof row.questions_count === 'number' &&
    (row.score === null || typeof row.score === 'number') &&
    typeof row.in_progress === 'boolean'
  );
}

function isTopicAggRow(row: Record<string, unknown>): row is TopicAggRow {
  return (
    typeof row.topic_id === 'string' &&
    typeof row.topic_name === 'string' &&
    typeof row.topic_description === 'string' &&
    typeof row.category === 'string' &&
    typeof row.questions_count === 'number' &&
    Array.isArray(row.questions)
  );
}

function isAnswerValidationRow(row: Record<string, unknown>): row is AnswerValidationRow {
  return typeof row.is_correct === 'boolean' && typeof row.question_id === 'string';
}

function isAttemptDatabaseRow(row: Record<string, unknown>): row is AttemptDatabaseRow {
  return (
    typeof row.id === 'string' &&
    typeof row.user_id === 'string' &&
    typeof row.topic_id === 'string' &&
    typeof row.current_step === 'number' &&
    (row.completed_at === null || row.completed_at instanceof Date) &&
    row.created_at instanceof Date &&
    row.updated_at instanceof Date
  );
}

function toCategorySummary(row: Record<string, unknown>): QuizCategorySummary {
  if (!isCategoryRow(row)) {
    throw new Error('Unexpected quiz category row shape from database');
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

function toTopicSummary(row: Record<string, unknown>): QuizTopicSummary {
  if (!isTopicSummaryRow(row)) {
    throw new Error('Unexpected quiz topic summary row shape from database');
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    questionsCount: row.questions_count,
    score: row.score,
    inProgress: row.in_progress,
  };
}

function toAttemptData(row: Record<string, unknown>): AttemptData {
  if (!isAttemptDatabaseRow(row)) {
    throw new Error('Unexpected quiz attempt row shape from database');
  }

  return {
    id: row.id,
    userId: row.user_id,
    topicId: row.topic_id,
    currentStep: row.current_step,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

@Injectable()
export class QuizRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findAllCategories(userId: string, lang: 'en' | 'ru'): Promise<QuizCategorySummary[]> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT
         qc.id,
         CASE WHEN $2 = 'en' THEN qc.name_en ELSE qc.name_ru END AS name,
         CASE WHEN $2 = 'en' THEN qc.description_en ELSE qc.description_ru END AS description,
         COUNT(qt.id)::INT AS topics_count,
         COUNT(CASE WHEN latest.completed_at IS NOT NULL THEN 1 END)::INT AS topics_complete_count,
         CASE
           WHEN COUNT(qt.id) = 0 THEN 0
           ELSE COUNT(CASE WHEN latest.completed_at IS NOT NULL THEN 1 END)::FLOAT / COUNT(qt.id)
         END AS progress
       FROM quiz_categories qc
       LEFT JOIN quiz_topics qt ON qt.category_id = qc.id
       LEFT JOIN LATERAL (
         SELECT completed_at
         FROM user_quiz_attempts
         WHERE user_id = $1 AND topic_id = qt.id
         ORDER BY created_at DESC
         LIMIT 1
       ) latest ON true
       GROUP BY qc.id, qc.name_en, qc.name_ru, qc.description_en, qc.description_ru
       ORDER BY qc.created_at`,
      [userId, lang],
    );

    return result.rows.map((row) => toCategorySummary(row));
  }

  async findCategoryById(
    id: string,
    userId: string,
    lang: 'en' | 'ru',
  ): Promise<
    (Omit<GetCategoryResponseDto, 'topics'> & { topics: QuizTopicSummary[] }) | undefined
  > {
    const catResult = await this.pool.query<Record<string, unknown>>(
      `SELECT
         id,
         CASE WHEN $2 = 'en' THEN name_en ELSE name_ru END AS name,
         CASE WHEN $2 = 'en' THEN description_en ELSE description_ru END AS description
       FROM quiz_categories
       WHERE id = $1`,
      [id, lang],
    );

    const catRow = catResult.rows[0];

    if (!catRow) return undefined;

    if (!isCategoryBasicRow(catRow)) {
      throw new Error('Unexpected quiz category row shape from database');
    }

    const topicsResult = await this.pool.query<Record<string, unknown>>(
      `WITH latest_completed_attempts AS (
         SELECT DISTINCT ON (topic_id) id, topic_id
         FROM user_quiz_attempts
         WHERE user_id = $2 AND completed_at IS NOT NULL
         ORDER BY topic_id, completed_at DESC
       ),
       topic_scores AS (
         SELECT
           lca.topic_id,
           ROUND(
             COUNT(uqr.id) FILTER (WHERE qa.is_correct = true)::FLOAT /
             NULLIF(COUNT(qq.id), 0) * 100
           )::INT AS score
         FROM latest_completed_attempts lca
         JOIN quiz_questions qq ON qq.topic_id = lca.topic_id
         LEFT JOIN user_question_responses uqr ON uqr.attempt_id = lca.id AND uqr.question_id = qq.id
         LEFT JOIN quiz_answers qa ON qa.id = uqr.answer_id
         GROUP BY lca.topic_id
       )
       SELECT
         qt.id,
         CASE WHEN $3 = 'en' THEN qt.name_en ELSE qt.name_ru END AS name,
         CASE WHEN $3 = 'en' THEN qt.description_en ELSE qt.description_ru END AS description,
         COUNT(qq.id)::INT AS questions_count,
         ts.score,
         EXISTS (
           SELECT 1 FROM user_quiz_attempts
           WHERE user_id = $2 AND topic_id = qt.id AND completed_at IS NULL
         ) AS in_progress
       FROM quiz_topics qt
       LEFT JOIN quiz_questions qq ON qq.topic_id = qt.id
       LEFT JOIN topic_scores ts ON ts.topic_id = qt.id
       WHERE qt.category_id = $1
       GROUP BY qt.id, qt.name_en, qt.name_ru, qt.description_en, qt.description_ru, ts.score
       ORDER BY qt.created_at`,
      [id, userId, lang],
    );

    const topics = topicsResult.rows.map((row) => toTopicSummary(row));
    const topicsCount = topics.length;
    const topicsCompleteCount = topics.filter((topic) => topic.score !== null).length;
    const progress = topicsCount === 0 ? 0 : topicsCompleteCount / topicsCount;

    return {
      id: catRow.id,
      name: catRow.name,
      description: catRow.description,
      topics,
      topicsCount,
      topicsCompleteCount,
      progress,
    };
  }

  async findTopicWithQuestions(
    id: string,
    lang: 'en' | 'ru',
  ): Promise<
    | {
        id: string;
        name: string;
        description: string;
        category: string;
        questions: QuizQuestion[];
        questionsCount: number;
      }
    | undefined
  > {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT
         qt.id AS topic_id,
         CASE WHEN $2 = 'en' THEN qt.name_en ELSE qt.name_ru END AS topic_name,
         CASE WHEN $2 = 'en' THEN qt.description_en ELSE qt.description_ru END AS topic_description,
         CASE WHEN $2 = 'en' THEN qc.name_en ELSE qc.name_ru END AS category,
         COUNT(DISTINCT qq.id)::INT AS questions_count,
         COALESCE(
           json_agg(
             json_build_object(
               'id', qq.id,
               'name', CASE WHEN $2 = 'en' THEN qq.name_en ELSE qq.name_ru END,
               'codeSnippet', qq.code_snippet,
               'answers', (
                 SELECT COALESCE(
                   json_agg(
                     json_build_object(
                       'id', qa.id,
                       'text', CASE WHEN $2 = 'en' THEN qa.text_en ELSE qa.text_ru END
                     )
                     ORDER BY qa.id
                   ),
                   '[]'::json
                 )
                 FROM quiz_answers qa WHERE qa.question_id = qq.id
               )
             )
             ORDER BY qq.sort_order
           ) FILTER (WHERE qq.id IS NOT NULL),
           '[]'::json
         ) AS questions
       FROM quiz_topics qt
       JOIN quiz_categories qc ON qc.id = qt.category_id
       LEFT JOIN quiz_questions qq ON qq.topic_id = qt.id
       WHERE qt.id = $1
       GROUP BY qt.id, qt.name_en, qt.name_ru, qt.description_en, qt.description_ru,
                qc.name_en, qc.name_ru`,
      [id, lang],
    );

    const row = result.rows[0];

    if (!row) return undefined;

    if (!isTopicAggRow(row)) {
      throw new Error('Unexpected quiz topic row shape from database');
    }

    return {
      id: row.topic_id,
      name: row.topic_name,
      description: row.topic_description,
      category: row.category,
      questions: row.questions,
      questionsCount: row.questions_count,
    };
  }

  async findAnswerById(
    answerId: string,
  ): Promise<{ isCorrect: boolean; questionId: string } | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT is_correct, question_id FROM quiz_answers WHERE id = $1`,
      [answerId],
    );

    const row = result.rows[0];

    if (!row) return undefined;

    if (!isAnswerValidationRow(row)) {
      throw new Error('Unexpected quiz answer validation row shape from database');
    }

    return { isCorrect: row.is_correct, questionId: row.question_id };
  }

  async findQuestionExplanation(
    questionId: string,
    lang: 'en' | 'ru',
  ): Promise<string | null | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT CASE WHEN $2 = 'en' THEN explanation_en ELSE explanation_ru END AS explanation
       FROM quiz_questions WHERE id = $1`,
      [questionId, lang],
    );

    const row = result.rows[0];

    if (!row) return undefined;

    return typeof row.explanation === 'string' ? row.explanation : null;
  }

  async topicExists(id: string): Promise<boolean> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT 1 FROM quiz_topics WHERE id = $1`,
      [id],
    );

    return result.rows.length > 0;
  }

  async findLatestAttempt(userId: string, topicId: string): Promise<AttemptData | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT id, user_id, topic_id, current_step, completed_at, created_at, updated_at
       FROM user_quiz_attempts
       WHERE user_id = $1 AND topic_id = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId, topicId],
    );

    const row = result.rows[0];

    return row ? toAttemptData(row) : undefined;
  }

  async createAttempt(userId: string, topicId: string): Promise<AttemptData> {
    const result = await this.pool.query<Record<string, unknown>>(
      `INSERT INTO user_quiz_attempts (user_id, topic_id)
       VALUES ($1, $2)
       RETURNING id, user_id, topic_id, current_step, completed_at, created_at, updated_at`,
      [userId, topicId],
    );

    const row = result.rows[0];

    if (!row) throw new Error('createAttempt returned no rows');

    return toAttemptData(row);
  }

  async recordAndAdvanceAttempt(
    attemptId: string,
    questionId: string,
    answerId: string | null,
    topicId: string,
  ): Promise<{ completed: boolean }> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const lockResult = await client.query<Record<string, unknown>>(
        `SELECT current_step
         FROM user_quiz_attempts
         WHERE id = $1
         FOR UPDATE`,
        [attemptId],
      );

      const lockRow = lockResult.rows[0];

      if (!lockRow || typeof lockRow.current_step !== 'number') {
        throw new Error('Attempt not found');
      }

      const currentStep = lockRow.current_step;

      await client.query(
        `INSERT INTO user_question_responses (attempt_id, question_id, answer_id)
         VALUES ($1, $2, $3)`,
        [attemptId, questionId, answerId],
      );

      const countResult = await client.query<Record<string, unknown>>(
        `SELECT COUNT(*) AS count FROM quiz_questions WHERE topic_id = $1`,
        [topicId],
      );

      const countRow = countResult.rows[0];
      const total = countRow && typeof countRow.count === 'string' ? Number(countRow.count) : 0;
      const nextStep = currentStep + 1;
      let completed = false;

      if (nextStep >= total) {
        await client.query(
          `UPDATE user_quiz_attempts
           SET completed_at = NOW(), updated_at = NOW()
           WHERE id = $1`,
          [attemptId],
        );
        completed = true;
      } else {
        await client.query(
          `UPDATE user_quiz_attempts
           SET current_step = $2, updated_at = NOW()
           WHERE id = $1`,
          [attemptId, nextStep],
        );
      }

      await client.query('COMMIT');

      return { completed };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findLatestCompletedAttempt(
    userId: string,
    topicId: string,
  ): Promise<AttemptData | undefined> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT id, user_id, topic_id, current_step, completed_at, created_at, updated_at
       FROM user_quiz_attempts
       WHERE user_id = $1 AND topic_id = $2 AND completed_at IS NOT NULL
       ORDER BY completed_at DESC
       LIMIT 1`,
      [userId, topicId],
    );

    const row = result.rows[0];

    return row ? toAttemptData(row) : undefined;
  }

  async countCorrectResponsesInAttempt(attemptId: string): Promise<number> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT COUNT(uqr.id) AS count
       FROM user_question_responses uqr
       INNER JOIN quiz_answers qa ON qa.id = uqr.answer_id AND qa.is_correct = true
       WHERE uqr.attempt_id = $1`,
      [attemptId],
    );

    const row = result.rows[0];

    return row && typeof row.count === 'string' ? Number(row.count) : 0;
  }

  async countQuestionsInTopic(topicId: string): Promise<number> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT COUNT(*) AS count FROM quiz_questions WHERE topic_id = $1`,
      [topicId],
    );

    const row = result.rows[0];

    return row && typeof row.count === 'string' ? Number(row.count) : 0;
  }

  async findTopicLinks(topicId: string): Promise<string[]> {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT links FROM quiz_topics WHERE id = $1`,
      [topicId],
    );

    const row = result.rows[0];

    return row && Array.isArray(row.links) ? (row.links as string[]) : [];
  }
}
