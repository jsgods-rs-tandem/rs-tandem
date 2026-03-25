import type { AuthUser } from '@/shared/types';

export type ProfileState = 'view' | 'edit' | 'saving';

export interface ProfileFormData extends Partial<AuthUser> {
  currentPassword?: string;
  newPassword?: string;
}
