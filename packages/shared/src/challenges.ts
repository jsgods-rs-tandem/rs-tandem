export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface ChallengeSummary {
  id: string;
  name: string;
  description: string;
  topicsCount: number;
  topicsCompleteCount: number;
  progress: number;
}

export interface ChallengeTopicSummary {
  id: string;
  name: string;
  description: string;
  difficulty: ChallengeDifficulty;
  tags: string[];
  inProgress: boolean;
  isComplete: boolean;
}

export interface GetChallengesResponseDto {
  categories: ChallengeSummary[];
}

export interface GetChallengeCategoryResponseDto {
  id: string;
  categoryName: string;
  topicsCount: number;
  topicsCompleteCount: number;
  progress: number;
  topics: ChallengeTopicSummary[];
}
