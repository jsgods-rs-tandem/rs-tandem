import { Body, Controller, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import type { PublicUserProfileDto, UserDto, UserProfileDto } from '@rs-tandem/shared';
import { UpdateProfileDto } from './dto/index.js';
import { ProfilesService } from './profiles.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Request() request: Express.Request): Promise<UserProfileDto> {
    const user = request.user as UserDto;

    return this.profilesService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMyProfile(
    @Request() request: Express.Request,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    const user = request.user as UserDto;

    return this.profilesService.updateProfile(user.id, dto);
  }

  @Get(':id')
  getPublicProfile(@Param('id') id: string): Promise<PublicUserProfileDto> {
    return this.profilesService.getPublicProfile(id);
  }
}
