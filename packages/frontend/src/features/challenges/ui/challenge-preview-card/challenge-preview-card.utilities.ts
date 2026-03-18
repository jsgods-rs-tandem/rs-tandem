import { BadgeComponent } from '@/shared/ui';

export const computeDifficultyBadgeColor = (
  difficulty: string,
): ReturnType<BadgeComponent['color']> => {
  switch (difficulty) {
    case 'hard': {
      return 'error';
    }
    case 'medium': {
      return 'gold';
    }
    default:
      return 'success';
  }
};
