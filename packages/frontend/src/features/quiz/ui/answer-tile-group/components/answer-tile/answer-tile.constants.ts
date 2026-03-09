const ANSWER_STATUS = {
  success: 'success',
  error: 'error',
} as const;

type AnswerStatus = (typeof ANSWER_STATUS)[keyof typeof ANSWER_STATUS];

export { ANSWER_STATUS, type AnswerStatus };
