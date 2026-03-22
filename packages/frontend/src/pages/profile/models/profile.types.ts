import { UserDto, UserProfileDto } from '@rs-tandem/shared';

export type ProfileState = 'view' | 'edit' | 'saving';

export type AuthUser = UserDto & Partial<UserProfileDto>;

export interface ProfileFormData extends Partial<AuthUser> {
  currentPassword?: string;
  newPassword?: string;
}
