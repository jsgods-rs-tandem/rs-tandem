export const getRandomArrayIndex = (array: readonly unknown[]): number =>
  array.length === 0 ? 0 : Math.floor(Math.random() * array.length);

export const computeSubmitButtonText = (isSubmitted: boolean, isComplete: boolean) => {
  if (isComplete) {
    return 'See results';
  }

  return isSubmitted ? 'Next question' : 'Send answer';
};
