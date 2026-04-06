ALTER TABLE challenge_topics
  ALTER COLUMN tags DROP DEFAULT,
  ALTER COLUMN tags TYPE JSONB USING COALESCE(to_jsonb(tags), '[]'::jsonb),
  ALTER COLUMN tags SET DEFAULT '[]'::jsonb;
