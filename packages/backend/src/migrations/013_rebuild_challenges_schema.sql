DROP TABLE IF EXISTS user_challenge_progress;
DROP TABLE IF EXISTS challenge_topic_tags;
DROP TABLE IF EXISTS challenge_tags;
DROP TABLE IF EXISTS challenge_topics;
DROP TABLE IF EXISTS challenge_categories;

CREATE TABLE challenge_categories (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT        UNIQUE NOT NULL,
  name_en        TEXT        NOT NULL,
  name_ru        TEXT        NOT NULL,
  description_en TEXT        NOT NULL,
  description_ru TEXT        NOT NULL,
  sort_order     INT         NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE challenge_topics (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id    UUID        NOT NULL REFERENCES challenge_categories(id) ON DELETE CASCADE,
  slug           TEXT        UNIQUE NOT NULL,
  name_en        TEXT        NOT NULL,
  name_ru        TEXT        NOT NULL,
  description_en TEXT        NOT NULL,
  description_ru TEXT        NOT NULL,
  instructions_en TEXT       NOT NULL,
  instructions_ru TEXT       NOT NULL,
  difficulty     TEXT        NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags           JSONB       NOT NULL DEFAULT '[]'::JSONB,
  function_name  TEXT        NOT NULL,
  starter_code   TEXT        NOT NULL,
  builtin_fns    JSONB,
  test_cases     JSONB       NOT NULL DEFAULT '[]'::JSONB,
  sort_order     INT         NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX challenge_topics_category_id_idx ON challenge_topics(category_id);

CREATE TABLE user_challenge_progress (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id     UUID        NOT NULL REFERENCES challenge_topics(id) ON DELETE CASCADE,
  status       TEXT        NOT NULL DEFAULT 'notStarted' CHECK (status IN ('notStarted', 'inProgress', 'completed')),
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, topic_id)
);

CREATE INDEX user_challenge_progress_user_id_idx ON user_challenge_progress(user_id);
CREATE INDEX user_challenge_progress_topic_id_idx ON user_challenge_progress(topic_id);
