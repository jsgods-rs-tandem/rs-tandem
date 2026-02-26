import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { UpdateProfileDto as IUpdateProfileDto } from '@rs-tandem/shared';

export class UpdateProfileDto implements IUpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  displayName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
