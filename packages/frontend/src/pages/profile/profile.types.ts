import { UserDto } from '@rs-tandem/shared';

export type ProfileState = 'view' | 'edit' | 'saving' | 'error';

export interface AuthUser extends UserDto {
  avatarUrl?: string | null;
  githubUsername?: string | null;
}

export interface ProfileFormData extends Partial<AuthUser> {
  currentPassword?: string;
  newPassword?: string;
}

export interface ApiErrorResponse {
  message: string | string[];
  error?: string | null;
  statusCode?: number;
}
