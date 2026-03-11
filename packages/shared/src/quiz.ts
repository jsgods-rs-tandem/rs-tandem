export interface QuizAnswer {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  name: string;
  codeSnippet: string | null;
  answers: QuizAnswer[];
}

export interface QuizTopicSummary {
  id: string;
  name: string;
  description: string;
  questionsCount: number;
  score: number | null;
  inProgress: boolean;
}

export interface QuizTopic {
  id: string;
  name: string;
  description: string;
  category: string;
  questions: QuizQuestion[];
  questionsCount: number;
  step: number;
}

export interface QuizCategorySummary {
  id: string;
  name: string;
  description: string;
  topicsCount: number;
  topicsCompleteCount: number;
  progress: number;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  topics: QuizTopicSummary[];
  topicsCount: number;
  topicsCompleteCount: number;
  progress: number;
}

export interface GetCategoriesResponseDto {
  categories: QuizCategorySummary[];
}

export interface GetCategoryResponseDto {
  id: string;
  name: string;
  description: string;
  topics: QuizTopicSummary[];
  topicsCount: number;
  topicsCompleteCount: number;
  progress: number;
}

export interface GetTopicResponseDto {
  id: string;
  name: string;
  description: string;
  category: string;
  questions: QuizQuestion[];
  questionsCount: number;
  step: number;
}

export interface GetResultsResponseDto {
  results: {
    score: number;
    links: string[];
  };
}

export interface SubmitAnswerRequestDto {
  answerId: string;
  isTimeUp: boolean;
}

export interface SubmitAnswerResponseDto {
  isCorrect: boolean;
  explanation: string | null;
}

export interface StartTopicResponseDto {
  step: number;
}
