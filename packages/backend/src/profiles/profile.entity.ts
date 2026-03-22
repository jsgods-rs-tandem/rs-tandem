export interface UserProfileRow {
  userId: string;
  totalXp: number;
  level: number;
  problemsSolved: number;
  currentStreak: number;
  longestStreak: number;
  lastSolvedAt: Date | null;
  updatedAt: Date;
  avatarUrl: string | null;
  githubUsername: string | null;
}

export interface CreateUserProfileInput {
  userId: string;
}

export interface UpdateProfileInput {
  avatarUrl?: string | null;
  githubUsername?: string | null;
}
