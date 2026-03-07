export const computeQuestionsCount = (count: number) => {
  const countAsString = String(count);

  if (count % 10 === 1) {
    return `${countAsString} question`;
  }

  return `${countAsString} questions`;
};
