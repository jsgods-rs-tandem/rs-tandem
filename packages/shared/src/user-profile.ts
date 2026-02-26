export interface PublicUserProfileDto {
  userId: string;
  displayName: string;
  totalXp: number;
  level: number;
  problemsSolved: number;
  currentStreak: number;
}

export interface UserProfileDto extends PublicUserProfileDto {
  email: string;
  longestStreak: number;
  lastSolvedAt: string | null;
}

export interface UpdateProfileDto {
  displayName?: string;
  email?: string;
}
