import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository.js';
import { UsersService } from './users.service.js';

@Module({
  providers: [UserRepository, UsersService],
  exports: [UserRepository, UsersService],
})
export class UsersModule {}
