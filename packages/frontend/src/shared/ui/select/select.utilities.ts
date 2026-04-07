import type { Option } from './select.types';

const findFirstSelectedOption = (options: Option[], selectedOptionValues: string[]) =>
  options.find((option) => option.value === selectedOptionValues.at(0));

const computePlaceholder = (
  options: Option[],
  selectedOptionValues: string[],
  placeholder = '',
) => {
  const selectedCount = selectedOptionValues.length;

  if (selectedCount <= 0) {
    return placeholder;
  }

  const firstSelectedOption = findFirstSelectedOption(options, selectedOptionValues);

  if (!firstSelectedOption) {
    return `Selected: ${String(selectedCount)}`;
  }

  const restSelectedCount = selectedCount - 1;

  return `${firstSelectedOption.text}${restSelectedCount > 0 ? ` +${String(restSelectedCount)}` : ''}`;
};

export { computePlaceholder };
