import { Component, input, computed } from '@angular/core';

import { BadgeComponent, ButtonComponent } from '@/shared/ui';

import { computeRewardLevel } from '@/features/quiz/utilities';
import { computeBadgeRewardLevelColor } from './topic-card.utilities';

import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

import type { AppTranslationKey } from '@/shared/types/translation-keys';

@Component({
  selector: 'app-topic-card',
  imports: [ButtonComponent, BadgeComponent, TypedTranslocoPipe],
  templateUrl: './topic-card.component.html',
  styleUrl: './topic-card.component.scss',
  standalone: true,
})
export class TopicCardComponent {
  readonly id = input.required<string>();
  readonly questionsCount = input.required<number>();

  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly score = input<number | null>();
  readonly inProgress = input<boolean>();

  protected readonly _badgeRewardLevel = computed(() => {
    const s = this.score();

    return typeof s === 'number' ? computeRewardLevel(s) : null;
  });

  protected readonly _badgeRewardLevelColor = computed(() =>
    computeBadgeRewardLevelColor(this._badgeRewardLevel()),
  );

  protected readonly _questionsCountTranslationKey = computed<AppTranslationKey>(() =>
    this.questionsCount() === 1
      ? 'quiz.topicCard.questions.single'
      : 'quiz.topicCard.questions.multiple',
  );

  protected readonly _badgeRewardLevelTranslationKey = computed<AppTranslationKey | null>(() => {
    const rewardLevel = this._badgeRewardLevel();

    if (!rewardLevel) {
      return null;
    }

    return `quiz.topicCard.badges.level.${rewardLevel}` as AppTranslationKey;
  });
}
