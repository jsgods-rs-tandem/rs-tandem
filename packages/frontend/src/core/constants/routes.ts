export const ROUTES = {
  home: '',
  signIn: 'sign-in',
  signUp: 'sign-up',
  profile: 'profile',
  library: 'library',
  aiChat: 'ai-chat',
  settings: 'settings',
  quiz: 'quiz',
  quizCategory: ':categoryId',
  quizTopic: 'topic/:topicId',
  quizResults: 'results',
  dashboard: 'dashboard',
  notFound: '404',
  wildcard: '**',
} as const;

export const ROUTE_PATHS = {
  home: '/',
  signIn: `/${ROUTES.signIn}`,
  signUp: `/${ROUTES.signUp}`,
  profile: `/${ROUTES.profile}`,
  library: `/${ROUTES.library}`,
  aiChat: `/${ROUTES.aiChat}`,
  settings: `/${ROUTES.settings}`,
  quiz: `/${ROUTES.quiz}`,
  dashboard: `/${ROUTES.dashboard}`,
  notFound: `/${ROUTES.notFound}`,
} as const;
