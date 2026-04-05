export type { LoginDto, RegisterDto, AuthResponseDto, UserDto, ChangePasswordDto } from './auth.js';
export type { PublicUserProfileDto, UserProfileDto, UpdateProfileDto } from './user-profile.js';
export type {
  AiMessage,
  AiProviderDto,
  AiSettingsDto,
  UpdateAiSettingsDto,
  AiChatRequestDto,
  AiChatResponseDto,
  UserMessageDto,
} from './ai.js';
export type {
  ChallengeDifficulty,
  ChallengeSummary,
  ChallengeTopicSummary,
  GetChallengesResponseDto,
  GetChallengeCategoryResponseDto,
} from './challenges.js';
export type {
  QuizAnswer,
  QuizQuestion,
  QuizTopicSummary,
  QuizTopic,
  QuizCategorySummary,
  QuizCategory,
  GetCategoriesResponseDto,
  GetCategoryResponseDto,
  GetTopicResponseDto,
  GetResultsResponseDto,
  SubmitAnswerRequestDto,
  SubmitAnswerResponseDto,
  StartTopicResponseDto,
} from './quiz.js';
