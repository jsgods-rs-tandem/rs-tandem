CREATE TABLE challenge_categories (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT        UNIQUE NOT NULL,
  name_en        TEXT        NOT NULL,
  name_ru        TEXT        NOT NULL,
  description_en TEXT        NOT NULL,
  description_ru TEXT        NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE challenge_topics (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id    UUID        NOT NULL REFERENCES challenge_categories(id) ON DELETE CASCADE,
  slug           TEXT        UNIQUE NOT NULL,
  name_en        TEXT        NOT NULL,
  name_ru        TEXT        NOT NULL,
  description_en TEXT        NOT NULL,
  description_ru TEXT        NOT NULL,
  difficulty     TEXT        NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  sort_order     INT         NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX challenge_topics_category_id_idx ON challenge_topics(category_id);

CREATE TABLE challenge_tags (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE challenge_topic_tags (
  topic_id UUID NOT NULL REFERENCES challenge_topics(id) ON DELETE CASCADE,
  tag_id   UUID NOT NULL REFERENCES challenge_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (topic_id, tag_id)
);

CREATE INDEX challenge_topic_tags_tag_id_idx ON challenge_topic_tags(tag_id);

CREATE TABLE user_challenge_progress (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id     UUID        NOT NULL REFERENCES challenge_topics(id) ON DELETE CASCADE,
  status       TEXT        NOT NULL DEFAULT 'not_started',
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, topic_id)
);

CREATE INDEX user_challenge_progress_user_id_idx  ON user_challenge_progress(user_id);
CREATE INDEX user_challenge_progress_topic_id_idx ON user_challenge_progress(topic_id);
