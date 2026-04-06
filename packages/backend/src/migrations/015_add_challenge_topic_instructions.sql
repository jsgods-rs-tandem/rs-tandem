ALTER TABLE challenge_topics
  ADD COLUMN IF NOT EXISTS instructions_en TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS instructions_ru TEXT NOT NULL DEFAULT '';

UPDATE challenge_topics
SET
  instructions_en = CASE
    WHEN instructions_en = '' THEN description_en
    ELSE instructions_en
  END,
  instructions_ru = CASE
    WHEN instructions_ru = '' THEN description_ru
    ELSE instructions_ru
  END;

ALTER TABLE challenge_topics
  ALTER COLUMN instructions_en DROP DEFAULT,
  ALTER COLUMN instructions_ru DROP DEFAULT;
