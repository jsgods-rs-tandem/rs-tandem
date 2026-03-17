export const ROUTES = {
  home: '',
  signIn: 'sign-in',
  signUp: 'sign-up',
  profile: 'profile',
  library: 'library',
  aiChat: 'ai-chat',
  challenges: 'challenges',
  quiz: 'quiz',
  quizCategory: ':categoryId',
  quizTopic: 'topic/:topicId',
  quizResults: 'results',
  dashboard: 'dashboard',
  notFound: '**',
} as const;

export const ROUTE_PATHS = {
  home: '/',
  signIn: `/${ROUTES.signIn}`,
  signUp: `/${ROUTES.signUp}`,
  profile: `/${ROUTES.profile}`,
  library: `/${ROUTES.library}`,
  aiChat: `/${ROUTES.aiChat}`,
  challenges: `/${ROUTES.challenges}`,
  quiz: `/${ROUTES.quiz}`,
  dashboard: `/${ROUTES.dashboard}`,
} as const;
