import { Injectable } from '@nestjs/common';
import type { UserDto } from '@rs-tandem/shared';
import { UserRepository } from './user.repository.js';
import type { UserRow } from './user.entity.js';

function toUserDto(row: UserRow): UserDto {
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<UserDto | undefined> {
    const row = await this.userRepository.findById(id);

    return row ? toUserDto(row) : undefined;
  }

  async findByEmail(email: string): Promise<UserDto | undefined> {
    const row = await this.userRepository.findByEmail(email);

    return row ? toUserDto(row) : undefined;
  }
}
