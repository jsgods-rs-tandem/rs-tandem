import ruTranslations from '../../../public/i18n/ru.json';

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Previous = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number ? Join<K, Paths<T[K], Previous[D]>> : never;
      }[keyof T]
    : '';

export type AppTranslationKey = Exclude<Paths<typeof ruTranslations>, ''>;
