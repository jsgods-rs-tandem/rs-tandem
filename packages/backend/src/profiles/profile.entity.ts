export interface UserProfileRow {
  userId: string;
  totalXp: number;
  level: number;
  problemsSolved: number;
  currentStreak: number;
  longestStreak: number;
  lastSolvedAt: Date | null;
  updatedAt: Date;
}

export interface CreateUserProfileInput {
  userId: string;
}
