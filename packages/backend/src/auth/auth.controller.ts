import { Body, Controller, Get, HttpCode, Patch, Post, Request, UseGuards } from '@nestjs/common';
import type { AuthResponseDto, UserDto } from '@rs-tandem/shared';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { ChangePasswordDto, LoginDto, RegisterDto } from './dto/index.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto): Promise<UserDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() request: Express.Request): UserDto {
    return request.user as UserDto;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @HttpCode(204)
  changePassword(
    @Request() request: Express.Request,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changePassword((request.user as UserDto).id, dto);
  }
}
