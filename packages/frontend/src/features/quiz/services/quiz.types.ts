import type {
  GetTopicResponseDto,
  GetResultsResponseDto,
  SubmitAnswerResponseDto,
  QuizCategorySummary,
  QuizCategory,
} from '@rs-tandem/shared';

interface QuizState {
  data: {
    categories: QuizCategorySummary[];
    category: QuizCategory | null;
    topic: GetTopicResponseDto | null;
    step: number;
    answer: SubmitAnswerResponseDto | null;
    results: GetResultsResponseDto['results'] | null;
  };
  loading: {
    categories: boolean;
    category: boolean;
    topic: boolean;
    step: boolean;
    answer: boolean;
    results: boolean;
  };
}

export type { QuizState };
