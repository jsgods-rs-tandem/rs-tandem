import { Theme } from '@/shared/types';

export function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}
