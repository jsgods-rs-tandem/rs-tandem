import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { RegisterDto as IRegisterDto } from '@rs-tandem/shared';

export class RegisterDto implements IRegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  displayName?: string;
}
