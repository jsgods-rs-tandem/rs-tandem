CREATE TABLE IF NOT EXISTS user_chat_history (
  id          SERIAL         PRIMARY KEY,
  role TEXT,
  content TEXT NOT NULL,
  user_id     UUID        REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
