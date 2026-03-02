CREATE TABLE IF NOT EXISTS user_profiles (
  user_id         UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_xp        INT         NOT NULL DEFAULT 0,
  level           INT         NOT NULL DEFAULT 1,
  problems_solved INT         NOT NULL DEFAULT 0,
  current_streak  INT         NOT NULL DEFAULT 0,
  longest_streak  INT         NOT NULL DEFAULT 0,
  last_solved_at  TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
