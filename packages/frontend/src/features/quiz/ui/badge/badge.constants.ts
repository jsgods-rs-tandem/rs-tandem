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
