import type { AppTranslationKey } from '@/shared/types/translation-keys';

export const getRandomArrayIndex = (array: readonly unknown[]): number =>
  array.length === 0 ? 0 : Math.floor(Math.random() * array.length);

export const computeSubmitButtonText = (
  isSubmitted: boolean,
  isComplete: boolean,
): AppTranslationKey => {
  if (isComplete) {
    return 'quiz.quizPage.actions.seeResults';
  }

  return isSubmitted ? 'quiz.quizPage.actions.nextQuestion' : 'quiz.quizPage.actions.sendAnswer';
};
