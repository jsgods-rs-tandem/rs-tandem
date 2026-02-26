import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { ProfileRepository } from './profile.repository.js';
import { ProfilesService } from './profiles.service.js';
import { ProfilesController } from './profiles.controller.js';

@Module({
  imports: [UsersModule],
  providers: [ProfileRepository, ProfilesService],
  controllers: [ProfilesController],
  exports: [ProfileRepository, ProfilesService],
})
export class ProfilesModule {}
