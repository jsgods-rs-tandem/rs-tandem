import { ROUTE_PATHS } from '@/core/constants';

export const features = [
  {
    heading: 'AI',
    description:
      'Practice JS/TS with an AI tutor right inside the platform.\nAsk questions, request explanations, or get hints for tricky topics.\nThe chat streams responses and keeps the dialogue context.\nPerfect for quick clarifications, interview prep, and focused learning sessions',
    href: ROUTE_PATHS.aiChat,
  },
  {
    heading: 'Challenges',
    description:
      "Solve interactive JS and algorithmic tasks from top-tier tech interviews. Master the specific logic and data structures you'll face in real-world technical screenings. Write code, run tests, and track your progress as you bridge the gap between basic coding and high-level engineering",
    href: ROUTE_PATHS.challenges,
  },
  {
    heading: 'Quiz',
    description:
      'Pick a category and topic, then answer programming questions fast.\nYou have 2 minutes — a quick interview warm-up.\nAfter the round you get your score, feedback, and links to reinforce learning and go deeper.\nEarn badges and track your progress over time',
    href: ROUTE_PATHS.quiz,
  },
] as const;
