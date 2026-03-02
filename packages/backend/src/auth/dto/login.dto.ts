import { IsEmail, IsString, MinLength } from 'class-validator';
import type { LoginDto as ILoginDto } from '@rs-tandem/shared';

export class LoginDto implements ILoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
