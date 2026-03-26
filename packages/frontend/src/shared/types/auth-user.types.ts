import { UserDto, UserProfileDto } from '@rs-tandem/shared';

export type AuthUser = UserDto & Partial<UserProfileDto>;
