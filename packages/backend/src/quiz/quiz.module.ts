import { Module } from '@nestjs/common';
import { QuizRepository } from './quiz.repository.js';
import { QuizService } from './quiz.service.js';
import { QuizController } from './quiz.controller.js';

@Module({
  providers: [QuizRepository, QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
