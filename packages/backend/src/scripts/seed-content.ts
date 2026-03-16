import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool, PoolClient } from 'pg';

interface LocalizedText {
  en: string;
  ru: string;
}

interface Answer {
  text: LocalizedText;
  isCorrect: boolean;
}

interface Question {
  sortOrder: number;
  name: LocalizedText;
  codeSnippet: string | null;
  explanation: LocalizedText;
  answers: Answer[];
}

interface Topic {
  name: LocalizedText;
  description: LocalizedText;
  links: string[];
  questions: Question[];
}

interface CategoryFile {
  category: {
    name: LocalizedText;
    description: LocalizedText;
  };
  topics: Topic[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function categorySlugFromFilename(filename: string): string {
  // "01-html-css.json" → "html-css"
  return filename.replace(/\.json$/, '').replace(/^\d+-/, '');
}

async function upsertFile(
  client: PoolClient,
  filename: string,
  content: CategoryFile,
): Promise<void> {
  const categorySlug = categorySlugFromFilename(filename);

  const categoryResult = await client.query<{ id: string }>(
    `INSERT INTO quiz_categories (name_en, name_ru, description_en, description_ru, slug)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (slug) DO UPDATE SET
       name_en        = EXCLUDED.name_en,
       name_ru        = EXCLUDED.name_ru,
       description_en = EXCLUDED.description_en,
       description_ru = EXCLUDED.description_ru,
       updated_at     = NOW()
     RETURNING id`,
    [
      content.category.name.en,
      content.category.name.ru,
      content.category.description.en,
      content.category.description.ru,
      categorySlug,
    ],
  );
  const categoryId = categoryResult.rows[0]?.id;
  if (!categoryId) throw new Error(`Failed to upsert category: ${categorySlug}`);

  for (const topic of content.topics) {
    const topicSlug = `${categorySlug}/${slugify(topic.name.en)}`;

    const topicResult = await client.query<{ id: string }>(
      `INSERT INTO quiz_topics (category_id, name_en, name_ru, description_en, description_ru, links, slug)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO UPDATE SET
         category_id    = EXCLUDED.category_id,
         name_en        = EXCLUDED.name_en,
         name_ru        = EXCLUDED.name_ru,
         description_en = EXCLUDED.description_en,
         description_ru = EXCLUDED.description_ru,
         links          = EXCLUDED.links,
         updated_at     = NOW()
       RETURNING id`,
      [
        categoryId,
        topic.name.en,
        topic.name.ru,
        topic.description.en,
        topic.description.ru,
        topic.links,
        topicSlug,
      ],
    );
    const topicId = topicResult.rows[0]?.id;
    if (!topicId) throw new Error(`Failed to upsert topic: ${topicSlug}`);

    for (const question of topic.questions) {
      const questionSlug = `${topicSlug}/${String(question.sortOrder)}`;

      const questionResult = await client.query<{ id: string }>(
        `INSERT INTO quiz_questions (topic_id, sort_order, name_en, name_ru, code_snippet, explanation_en, explanation_ru, slug)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (slug) DO UPDATE SET
           topic_id       = EXCLUDED.topic_id,
           sort_order     = EXCLUDED.sort_order,
           name_en        = EXCLUDED.name_en,
           name_ru        = EXCLUDED.name_ru,
           code_snippet   = EXCLUDED.code_snippet,
           explanation_en = EXCLUDED.explanation_en,
           explanation_ru = EXCLUDED.explanation_ru
         RETURNING id`,
        [
          topicId,
          question.sortOrder,
          question.name.en,
          question.name.ru,
          question.codeSnippet,
          question.explanation.en,
          question.explanation.ru,
          questionSlug,
        ],
      );
      const questionId = questionResult.rows[0]?.id;
      if (!questionId) throw new Error(`Failed to upsert question: ${questionSlug}`);

      for (let index = 0; index < question.answers.length; index++) {
        const answer = question.answers[index];
        if (!answer) continue;
        const answerSlug = `${questionSlug}/${String(index)}`;

        await client.query(
          `INSERT INTO quiz_answers (question_id, text_en, text_ru, is_correct, slug)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (slug) DO UPDATE SET
             question_id = EXCLUDED.question_id,
             text_en     = EXCLUDED.text_en,
             text_ru     = EXCLUDED.text_ru,
             is_correct  = EXCLUDED.is_correct`,
          [questionId, answer.text.en, answer.text.ru, answer.isCorrect, answerSlug],
        );
      }
    }
  }
}

async function main(): Promise<void> {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionString: process.env.DATABASE_URL,
  });

  // In dev (ts-node from src/scripts/): ../quiz-content resolves to src/quiz-content correctly.
  // In production (compiled to dist/backend/src/scripts/): set QUIZ_CONTENT_DIR explicitly.
  const contentDirectory = process.env.QUIZ_CONTENT_DIR ?? join(__dirname, '..', 'quiz-content');
  const files = readdirSync(contentDirectory)
    .filter((f) => f.endsWith('.json'))
    .sort();

  console.warn(`Seeding ${String(files.length)} content files from ${contentDirectory}`);

  for (const filename of files) {
    const client = await pool.connect();
    try {
      const raw = readFileSync(join(contentDirectory, filename), 'utf8');
      const content = JSON.parse(raw) as CategoryFile;
      await client.query('BEGIN');
      await upsertFile(client, filename, content);
      await client.query('COMMIT');
      console.warn(`  ✓ ${filename}`);
    } catch (error: unknown) {
      await client.query('ROLLBACK');
      console.error(`  ✗ ${filename}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  await pool.end();
  console.warn('Seed complete.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
