import { UpdateProfileDto } from '@rs-tandem/shared';
import { AuthUser, ProfileFormData } from '../models/profile.types';

export function buildUpdateProfileDto(
  formData: ProfileFormData,
  currentUser: AuthUser,
): UpdateProfileDto {
  const dto: UpdateProfileDto = {};

  if (formData.displayName && formData.displayName !== currentUser.displayName) {
    dto.displayName = formData.displayName;
  }
  if (formData.email && formData.email !== currentUser.email) {
    dto.email = formData.email;
  }
  if (formData.githubUsername !== undefined) {
    const trimmedGithubUsername = formData.githubUsername?.trim() ?? null;

    if (trimmedGithubUsername !== currentUser.githubUsername) {
      dto.githubUsername = trimmedGithubUsername;
    }
  }
  if (formData.avatarUrl && formData.avatarUrl !== currentUser.avatarUrl) {
    dto.avatarUrl = formData.avatarUrl;
  }

  return dto;
}
