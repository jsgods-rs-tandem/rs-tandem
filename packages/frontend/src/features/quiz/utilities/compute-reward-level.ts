import { REWARD_LEVEL, REWARD_SCORE } from '../constants';

export const computeRewardLevel = (score: number) => {
  if (score >= REWARD_SCORE[REWARD_LEVEL.senior]) {
    return REWARD_LEVEL.senior;
  }

  if (score >= REWARD_SCORE[REWARD_LEVEL.middle]) {
    return REWARD_LEVEL.middle;
  }

  if (score >= REWARD_SCORE[REWARD_LEVEL.junior]) {
    return REWARD_LEVEL.junior;
  }

  return REWARD_LEVEL.trainee;
};
