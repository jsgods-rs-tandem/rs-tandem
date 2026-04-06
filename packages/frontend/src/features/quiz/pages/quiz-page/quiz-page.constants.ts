export const successAnswers = [
  'quiz.quizPage.comments.success.spotOn',
  'quiz.quizPage.comments.success.brilliant',
  'quiz.quizPage.comments.success.niceWork',
  'quiz.quizPage.comments.success.boom',
  'quiz.quizPage.comments.success.perfect',
  'quiz.quizPage.comments.success.excellent',
  'quiz.quizPage.comments.success.correct',
  'quiz.quizPage.comments.success.greatJob',
] as const;

export const errorAnswers = {
  required: 'quiz.quizPage.errors.required',
  requiredQuestionId: 'quiz.quizPage.errors.requiredQuestionId',
  timeExpired: 'quiz.quizPage.errors.timeExpired',
} as const;
