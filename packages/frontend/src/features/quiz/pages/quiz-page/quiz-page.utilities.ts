export const getRandomArrayIndex = (array: readonly unknown[]): number =>
  array.length === 0 ? 0 : Math.floor(Math.random() * array.length);

export const computeSubmitButtonText = (isSubmitted: boolean) =>
  isSubmitted ? 'Go to next question' : 'Send answer';
