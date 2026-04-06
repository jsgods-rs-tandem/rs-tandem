import type { AppTranslationKey } from '@/shared/types/translation-keys';

export const REWARD_LEVEL = {
  senior: 'senior',
  middle: 'middle',
  junior: 'junior',
  trainee: 'trainee',
} as const;

export const REWARD_SCORE = {
  [REWARD_LEVEL.senior]: 90,
  [REWARD_LEVEL.middle]: 70,
  [REWARD_LEVEL.junior]: 50,
} as const;

export const REWARD_PRAISE: Record<keyof typeof REWARD_LEVEL, AppTranslationKey> = {
  [REWARD_LEVEL.senior]: 'quiz.results.heading.senior',
  [REWARD_LEVEL.middle]: 'quiz.results.heading.middle',
  [REWARD_LEVEL.junior]: 'quiz.results.heading.junior',
  [REWARD_LEVEL.trainee]: 'quiz.results.heading.trainee',
} as const;
