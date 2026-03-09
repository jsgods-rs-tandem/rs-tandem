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

export const REWARD_PRAISE: Record<keyof typeof REWARD_LEVEL, string> = {
  [REWARD_LEVEL.senior]: 'Good job!\nYou’re a true Senior',
  [REWARD_LEVEL.middle]: 'Well done!\nSolid Middle performance',
  [REWARD_LEVEL.junior]: 'Keep it up!\nYou’re a confident Junior',
  [REWARD_LEVEL.trainee]: 'Keep going!\nTrainee stage complete',
} as const;
