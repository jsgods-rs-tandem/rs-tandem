import type { FormattedTextContent } from './formatted-text-content.types';

export const formatTextWithCode = (text: string) => {
  const textSize = text.length - 1;
  let wordWithFormatting = '';
  let wordWithoutFormatting = '';

  return text.split('').reduce<FormattedTextContent[]>((acc, letter, i) => {
    if (letter === '`') {
      if (wordWithoutFormatting) {
        acc.push({
          word: wordWithoutFormatting,
          shouldFormat: false,
        });
        wordWithoutFormatting = '';
      }

      if (wordWithFormatting) {
        acc.push({
          word: wordWithFormatting,
          shouldFormat: true,
        });
        wordWithFormatting = '';
      } else {
        wordWithFormatting += ' ';
      }
      return acc;
    }

    if (wordWithFormatting) {
      wordWithFormatting += letter;
      return acc;
    }

    wordWithoutFormatting += letter;

    if (textSize === i) {
      acc.push({
        word: wordWithoutFormatting,
        shouldFormat: false,
      });
    }

    return acc;
  }, []);
};
