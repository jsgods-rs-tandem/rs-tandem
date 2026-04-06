import type {
  GetChallengeCategoriesResponseDto,
  GetChallengeCategoryResponseDto,
  GetChallengeTopicResponseDto,
} from '@rs-tandem/shared';

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

interface State {
  data: {
    categories: GetChallengeCategoriesResponseDto['categories'];
    category: GetChallengeCategoryResponseDto | null;
    codeEditor: GetChallengeTopicResponseDto | null;
  };
  loading: {
    categories: boolean;
    category: boolean;
    codeEditor: boolean;
    solution: boolean;
  };
}

export type {
  State,
  ChallengeTestCase,
  GetChallengeCategoryResponseDto,
  GetChallengeTopicResponseDto,
};
