import { Module } from '@nestjs/common';
import { ChallengesRepository } from './challenges.repository.js';
import { ChallengesService } from './challenges.service.js';
import { ChallengesController } from './challenges.controller.js';

@Module({
  providers: [ChallengesRepository, ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
