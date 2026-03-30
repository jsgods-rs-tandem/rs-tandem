import { AppTranslationKey } from './translation-keys';

export interface TeamMember {
  nameKey: AppTranslationKey;
  avatarUrl: string;
  linkText?: string;
  linkUrl?: string;
  isRotate?: boolean;
}
