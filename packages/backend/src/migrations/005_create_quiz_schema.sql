CREATE TABLE IF NOT EXISTS quiz_categories (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en        TEXT        NOT NULL,
  name_ru        TEXT        NOT NULL,
  description_en TEXT        NOT NULL,
  description_ru TEXT        NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_topics (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id    UUID        NOT NULL REFERENCES quiz_categories(id) ON DELETE CASCADE,
  name_en        TEXT        NOT NULL,
  name_ru        TEXT        NOT NULL,
  description_en TEXT        NOT NULL,
  description_ru TEXT        NOT NULL,
  links          TEXT[]      NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quiz_topics_category_id_idx ON quiz_topics (category_id);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id       UUID        NOT NULL REFERENCES quiz_topics(id) ON DELETE CASCADE,
  sort_order     INT         NOT NULL,
  name_en        TEXT        NOT NULL,
  name_ru        TEXT        NOT NULL,
  code_snippet   TEXT,
  explanation_en TEXT,
  explanation_ru TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quiz_questions_topic_id_sort_order_idx ON quiz_questions (topic_id, sort_order);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID    NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  text_en     TEXT    NOT NULL,
  text_ru     TEXT    NOT NULL,
  is_correct  BOOLEAN NOT NULL DEFAULT false
);

CREATE UNIQUE INDEX IF NOT EXISTS quiz_answers_one_correct_per_question
  ON quiz_answers (question_id) WHERE is_correct = true;

CREATE INDEX IF NOT EXISTS quiz_answers_question_id_idx ON quiz_answers (question_id);

CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id     UUID        NOT NULL REFERENCES quiz_topics(id) ON DELETE CASCADE,
  current_step INT         NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_quiz_attempts_user_topic_created_idx
  ON user_quiz_attempts (user_id, topic_id, created_at DESC);

CREATE TABLE IF NOT EXISTS user_question_responses (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id  UUID        NOT NULL REFERENCES user_quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID        NOT NULL REFERENCES quiz_questions(id),
  answer_id   UUID        REFERENCES quiz_answers(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
