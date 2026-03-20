import { UserDto } from '@rs-tandem/shared';

export type ProfileState = 'view' | 'edit' | 'saving' | 'error';

export interface AuthUser extends UserDto {
  avatarUrl?: string;
}

export interface ProfileFormData extends Partial<AuthUser> {
  currentPassword?: string;
  newPassword?: string;
}

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}
