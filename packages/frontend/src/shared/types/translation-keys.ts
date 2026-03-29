import ruTranslations from '../../../public/i18n/ru.json';

type JsonLeaf = string | number | boolean | null;

type Join<K extends string, P extends string> = P extends '' ? K : `${K}.${P}`;

type Depth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type LeafPaths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends JsonLeaf
    ? ''
    : T extends unknown[]
      ? never
      : { [K in keyof T & string]: Join<K, LeafPaths<T[K], Depth[D]>> }[keyof T & string];

export type AppTranslationKey = LeafPaths<typeof ruTranslations>;
