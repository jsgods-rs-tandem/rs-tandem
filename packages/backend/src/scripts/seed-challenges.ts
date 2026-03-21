import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool, PoolClient } from 'pg';

interface LocalizedText {
  en: string;
  ru: string;
}

interface ChallengeTopic {
  name: LocalizedText;
  description: LocalizedText;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
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

async function upsertFile(
  client: PoolClient,
  filename: string,
  content: ChallengeFile,
): Promise<void> {
  const categorySlug = categorySlugFromFilename(filename);

  const categoryResult = await client.query<{ id: string }>(
    `INSERT INTO challenge_categories (name_en, name_ru, description_en, description_ru, slug)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (slug) DO UPDATE SET
       name_en        = EXCLUDED.name_en,
       name_ru        = EXCLUDED.name_ru,
       description_en = EXCLUDED.description_en,
       description_ru = EXCLUDED.description_ru
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

  for (let index = 0; index < content.topics.length; index++) {
    const topic = content.topics[index];
    if (!topic) continue;
    const topicSlug = `${categorySlug}/${slugify(topic.name.en)}`;

    const topicResult = await client.query<{ id: string }>(
      `INSERT INTO challenge_topics (category_id, name_en, name_ru, description_en, description_ru, difficulty, sort_order, slug)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (slug) DO UPDATE SET
         category_id    = EXCLUDED.category_id,
         name_en        = EXCLUDED.name_en,
         name_ru        = EXCLUDED.name_ru,
         description_en = EXCLUDED.description_en,
         description_ru = EXCLUDED.description_ru,
         difficulty     = EXCLUDED.difficulty,
         sort_order     = EXCLUDED.sort_order
       RETURNING id`,
      [
        categoryId,
        topic.name.en,
        topic.name.ru,
        topic.description.en,
        topic.description.ru,
        topic.difficulty,
        index,
        topicSlug,
      ],
    );
    const topicId = topicResult.rows[0]?.id;
    if (!topicId) throw new Error(`Failed to upsert topic: ${topicSlug}`);

    // Delete existing tag links for this topic before re-linking
    await client.query(`DELETE FROM challenge_topic_tags WHERE topic_id = $1`, [topicId]);

    for (const tagName of topic.tags) {
      const normalizedName = tagName.trim();

      const tagResult = await client.query<{ id: string }>(
        `INSERT INTO challenge_tags (name)
         VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [normalizedName],
      );
      const tagId = tagResult.rows[0]?.id;
      if (!tagId) throw new Error(`Failed to upsert tag: ${normalizedName}`);

      await client.query(
        `INSERT INTO challenge_topic_tags (topic_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [topicId, tagId],
      );
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
