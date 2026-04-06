import type { AppTranslationKey } from '@/shared/types/translation-keys';
import type { Difficulty } from './challenge-preview-card.types';

const DIFFICULTY_TRANSLATION_KEYS: Record<Difficulty, AppTranslationKey> = {
  easy: 'challenges.category.previewCard.difficulty.easy',
  medium: 'challenges.category.previewCard.difficulty.medium',
  hard: 'challenges.category.previewCard.difficulty.hard',
};

export { DIFFICULTY_TRANSLATION_KEYS };
