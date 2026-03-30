CREATE TABLE IF NOT EXISTS user_ai_settings (
  user_id     UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  provider_id TEXT        NOT NULL,
  api_key     TEXT,
  model       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
