import { AppTranslationKey } from '@/shared/types/translation-keys';

export interface NavLink {
  label: AppTranslationKey;
  path: string;
  isAnchor?: boolean;
}
