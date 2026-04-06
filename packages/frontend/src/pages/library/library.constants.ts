import { ROUTE_PATHS } from '@/core/constants';

export const FEATURES_HREF_HASH: Record<string, string> = {
  ai: ROUTE_PATHS.aiChat,
  challenges: ROUTE_PATHS.challenges,
  quiz: ROUTE_PATHS.quiz,
} as const;
