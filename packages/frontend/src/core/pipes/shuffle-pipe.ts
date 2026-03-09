import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shuffle',
  standalone: true,
})
export class ShufflePipe implements PipeTransform {
  transform<T>(array: readonly T[] | null | undefined): T[] {
    if (!array) {
      return [];
    }

    const copy = [...array];

    for (let i = 0; i < copy.length; i += 1) {
      const index = Math.floor(Math.random() * (i + 1));

      const temporary = copy[i];
      copy[i] = copy[index] as T;
      copy[index] = temporary as T;
    }

    return copy;
  }
}
