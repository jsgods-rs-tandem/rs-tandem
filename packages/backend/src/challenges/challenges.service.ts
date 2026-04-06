import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  GetChallengeCategoriesResponseDto,
  GetChallengeCategoryResponseDto,
  GetChallengeTopicResponseDto,
  UpdateChallengeStatusResponseDto,
} from '@rs-tandem/shared';
import { ChallengesRepository } from './challenges.repository.js';
import type { UpdateChallengeStatusDto } from './dto/update-challenge-status.dto.js';

@Injectable()
export class ChallengesService {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async getCategories(
    userId: string,
    lang: 'en' | 'ru',
  ): Promise<GetChallengeCategoriesResponseDto> {
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
      throw new NotFoundException('challenges.category_not_found');
    }

    return category;
  }

  async getTopicById(
    id: string,
    userId: string,
    lang: 'en' | 'ru',
  ): Promise<GetChallengeTopicResponseDto> {
    const topic = await this.challengesRepository.findTopicById(id, userId, lang);

    if (!topic) {
      throw new NotFoundException('challenges.topic_not_found');
    }

    return topic;
  }

  async updateTopicStatus(
    userId: string,
    topicId: string,
    dto: UpdateChallengeStatusDto,
  ): Promise<UpdateChallengeStatusResponseDto> {
    const updatedStatus = await this.challengesRepository.upsertTopicStatus(
      userId,
      topicId,
      dto.status,
    );

    if (!updatedStatus) {
      throw new NotFoundException('challenges.topic_not_found');
    }

    return updatedStatus;
  }
}
