import { IsString, MinLength } from 'class-validator';
import type { ChangePasswordDto as IChangePasswordDto } from '@rs-tandem/shared';

export class ChangePasswordDto implements IChangePasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}
