import { Injectable, NotFoundException } from '@nestjs/common';
import type { GetChallengesResponseDto, GetChallengeCategoryResponseDto } from '@rs-tandem/shared';
import { ChallengesRepository } from './challenges.repository.js';

@Injectable()
export class ChallengesService {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async getCategories(userId: string, lang: 'en' | 'ru'): Promise<GetChallengesResponseDto> {
    const categories = await this.challengesRepository.findCategories(userId, lang);

    return { categories };
  }

  async getCategoryById(
    id: string,
    userId: string,
    lang: 'en' | 'ru',
  ): Promise<GetChallengeCategoryResponseDto> {
    const category = await this.challengesRepository.findCategoryById(id, userId, lang);

    if (!category) {
      throw new NotFoundException(`Challenge category ${id} not found`);
    }

    return category;
  }
}
