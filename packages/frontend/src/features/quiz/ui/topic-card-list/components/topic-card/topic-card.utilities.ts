import { BadgeComponent } from '@/shared/ui';

import { computeRewardLevel } from '@/features/quiz/utilities';

import { REWARD_LEVEL } from '@/features/quiz/constants';

export const computeQuestionsCount = (count: number) => {
  const countAsString = String(count);

  if (count % 10 === 1) {
    return `${countAsString} question`;
  }

  return `${countAsString} questions`;
};

export const computeBadgeRewardLevelColor = (
  level: ReturnType<typeof computeRewardLevel> | null,
): ReturnType<BadgeComponent['color']> => {
  switch (level) {
    case REWARD_LEVEL.senior: {
      return 'gold';
    }
    case REWARD_LEVEL.middle: {
      return 'silver';
    }
    case REWARD_LEVEL.junior: {
      return 'bronze';
    }
    default:
      return 'pink';
  }
};
