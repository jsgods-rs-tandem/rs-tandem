export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeStatus = 'notStarted' | 'inProgress' | 'completed';

export interface ChallengeTag {
  id: string;
  name: string;
}

export interface ChallengeCategorySummary {
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
  tags: ChallengeTag[];
  status: ChallengeStatus;
}

export interface ChallengeCategory {
  id: string;
  name: string;
  description: string;
  topicsCount: number;
  topicsCompleteCount: number;
  progress: number;
  topics: ChallengeTopicSummary[];
}

export interface BuiltinFunctionReference {
  $fn: string;
}

export interface ChallengeTestCase {
  id: number;
  description: string;
  args: unknown[];
  expected: unknown;
}

export interface ChallengeTopicDetails {
  id: string;
  name: string;
  description: string;
  instructions: string;
  categoryId: string;
  difficulty: ChallengeDifficulty;
  tags: ChallengeTag[];
  status: ChallengeStatus;
  functionName: string;
  starterCode: string;
  builtinFns?: Record<string, string>;
  testCases: ChallengeTestCase[];
}

export interface GetChallengeCategoriesResponseDto {
  categories: ChallengeCategorySummary[];
}

export interface GetChallengeCategoryResponseDto {
  id: string;
  name: string;
  description: string;
  topicsCount: number;
  topicsCompleteCount: number;
  progress: number;
  topics: ChallengeTopicSummary[];
}

export interface GetChallengeTopicResponseDto {
  id: string;
  name: string;
  description: string;
  instructions: string;
  categoryId: string;
  difficulty: ChallengeDifficulty;
  tags: ChallengeTag[];
  status: ChallengeStatus;
  functionName: string;
  starterCode: string;
  builtinFns?: Record<string, string>;
  testCases: ChallengeTestCase[];
}

export interface UpdateChallengeStatusRequestDto {
  status: 'inProgress' | 'completed';
}

export interface UpdateChallengeStatusResponseDto {
  topicId: string;
  status: ChallengeStatus;
}
