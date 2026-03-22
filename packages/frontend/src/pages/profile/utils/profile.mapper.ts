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
  if (
    formData.githubUsername !== undefined &&
    formData.githubUsername !== currentUser.githubUsername
  ) {
    dto.githubUsername = formData.githubUsername;
  }

  return dto;
}
