import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool, PoolClient } from 'pg';

interface LocalizedText {
  en: string;
  ru: string;
}

interface ChallengeTag extends LocalizedText {
  id?: string;
}

interface ChallengeTopic {
  name: LocalizedText;
  description: LocalizedText;
  instructions: LocalizedText;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: ChallengeTag[];
  functionName: string;
  starterCode: string;
  builtinFns?: Record<string, string>;
  testCases: {
    id: number;
    description: LocalizedText;
    args: unknown[];
    expected: unknown;
  }[];
}

interface ChallengeFile {
  category: {
    name: LocalizedText;
    description: LocalizedText;
  };
  topics: ChallengeTopic[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function categorySlugFromFilename(filename: string): string {
  return filename.replace(/\.json$/, '').replace(/^\d+-/, '');
}

function sortOrderFromFilename(filename: string): number {
  const match = /^(\d+)-/.exec(filename);

  return match ? Number(match[1]) : 0;
}

function toStoredChallengeTag(tag: ChallengeTag): Required<ChallengeTag> {
  return {
    id: tag.id ?? slugify(tag.en),
    en: tag.en,
    ru: tag.ru,
  };
}

async function upsertFile(
  client: PoolClient,
  filename: string,
  content: ChallengeFile,
): Promise<void> {
  const categorySortOrder = sortOrderFromFilename(filename);
  const categorySlug = categorySlugFromFilename(filename);

  const categoryResult = await client.query<{ id: string }>(
    `INSERT INTO challenge_categories (slug, name_en, name_ru, description_en, description_ru, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (slug) DO UPDATE SET
       name_en        = EXCLUDED.name_en,
       name_ru        = EXCLUDED.name_ru,
       description_en = EXCLUDED.description_en,
       description_ru = EXCLUDED.description_ru,
       sort_order     = EXCLUDED.sort_order,
       updated_at     = NOW()
     RETURNING id`,
    [
      categorySlug,
      content.category.name.en,
      content.category.name.ru,
      content.category.description.en,
      content.category.description.ru,
      categorySortOrder,
    ],
  );
  const categoryId = categoryResult.rows[0]?.id;
  if (!categoryId) throw new Error(`Failed to upsert category: ${categorySlug}`);

  for (let index = 0; index < content.topics.length; index++) {
    const topic = content.topics[index];
    if (!topic) continue;
    const topicSlug = `${categorySlug}/${slugify(topic.name.en)}`;

    const topicResult = await client.query<{ id: string }>(
      `INSERT INTO challenge_topics (
         category_id,
         slug,
         name_en,
         name_ru,
         description_en,
         description_ru,
         instructions_en,
         instructions_ru,
         difficulty,
         tags,
         function_name,
         starter_code,
         builtin_fns,
         test_cases,
         sort_order
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13::jsonb, $14::jsonb, $15)
       ON CONFLICT (slug) DO UPDATE SET
         category_id    = EXCLUDED.category_id,
         name_en        = EXCLUDED.name_en,
         name_ru        = EXCLUDED.name_ru,
         description_en = EXCLUDED.description_en,
         description_ru = EXCLUDED.description_ru,
         instructions_en = EXCLUDED.instructions_en,
         instructions_ru = EXCLUDED.instructions_ru,
         difficulty     = EXCLUDED.difficulty,
         tags           = EXCLUDED.tags,
         function_name  = EXCLUDED.function_name,
         starter_code   = EXCLUDED.starter_code,
         builtin_fns    = EXCLUDED.builtin_fns,
         test_cases     = EXCLUDED.test_cases,
         sort_order     = EXCLUDED.sort_order,
         updated_at     = NOW()
       RETURNING id`,
      [
        categoryId,
        topicSlug,
        topic.name.en,
        topic.name.ru,
        topic.description.en,
        topic.description.ru,
        topic.instructions.en,
        topic.instructions.ru,
        topic.difficulty,
        JSON.stringify(topic.tags.map((tag) => toStoredChallengeTag(tag))),
        topic.functionName,
        topic.starterCode,
        JSON.stringify(topic.builtinFns ?? null),
        JSON.stringify(topic.testCases),
        index,
      ],
    );
    const topicId = topicResult.rows[0]?.id;
    if (!topicId) throw new Error(`Failed to upsert topic: ${topicSlug}`);
  }

  await client.query(
    `DELETE FROM challenge_topics
     WHERE category_id = $1
       AND NOT (slug = ANY($2::TEXT[]))`,
    [categoryId, content.topics.map((topic) => `${categorySlug}/${slugify(topic.name.en)}`)],
  );
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

  const contentDirectory =
    process.env.CHALLENGE_CONTENT_DIR ?? join(__dirname, '..', 'challenge-content');
  const files = readdirSync(contentDirectory)
    .filter((f) => f.endsWith('.json'))
    .sort();

  console.warn(`Seeding ${String(files.length)} challenge content files from ${contentDirectory}`);

  for (const filename of files) {
    const client = await pool.connect();
    try {
      const raw = readFileSync(join(contentDirectory, filename), 'utf8');
      const content = JSON.parse(raw) as ChallengeFile;
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
  console.warn('Challenge seed complete.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
