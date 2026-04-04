interface ChallengeCategorySummary {
  id: string;
  name: string;
  description: string;
  topicsCount: number;
  topicsCompleteCount: number;
  progress: number;
}

interface ChallengeTopicSummary {
  id: string;
  name: string;
  description: string;
  // 'easy' | 'medium' | 'hard'
  difficulty: string;
  tags: string[];
  inProgress: boolean;
  isComplete: boolean;
}

interface GetChallengeCategoryResponseDto {
  id: string;
  name: string;
  description: string;
  topicsCount: number;
  topicsCompleteCount: number;
  progress: number;
  topics: ChallengeTopicSummary[];
}

interface ChallengeTestCase {
  id: number;
  description: string;
  args: unknown[];
  expected: unknown;
  matcher?: {
    kind: 'deepEqual' | 'toBe' | 'throws';
    errorName?: string;
    messageIncludes?: string;
  };
}

interface GetChallengeTopicResponseDto {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  functionName: string;
  starterCode: string;
  testCases: ChallengeTestCase[];
  builtinFns?: Record<string, string>;
}

interface SubmitChallengeAttemptResponseDto {
  topicId: string;
  isSolved: boolean;
}

interface State {
  data: {
    categories: ChallengeCategorySummary[];
    category: GetChallengeCategoryResponseDto | null;
    codeEditor: GetChallengeTopicResponseDto | null;
  };
  loading: {
    categories: boolean;
    category: boolean;
    codeEditor: boolean;
  };
}

type ChallengeCategory = GetChallengeCategoryResponseDto;
type ChallengeCodeEditor = GetChallengeTopicResponseDto;

export type {
  State,
  ChallengeCategorySummary,
  ChallengeTopicSummary,
  ChallengeCategory,
  ChallengeCodeEditor,
  ChallengeTestCase,
  GetChallengeCategoryResponseDto,
  GetChallengeTopicResponseDto,
  SubmitChallengeAttemptResponseDto,
};
