import { Component, input, computed } from '@angular/core';

import { BadgeComponent, ButtonComponent } from '@/shared/ui';

import { computeRewardLevel } from '@/features/quiz/utilities';
import { computeQuestionsCount, computeBadgeRewardLevelColor } from './topic-card.utilities';

@Component({
  selector: 'app-topic-card',
  imports: [ButtonComponent, BadgeComponent],
  templateUrl: './topic-card.component.html',
  styleUrl: './topic-card.component.scss',
  standalone: true,
})
export class TopicCardComponent {
  readonly id = input.required<string>();
  readonly questionsCount = input.required<number>();

  readonly heading = input.required<string>();
  readonly subheading = computed(() => computeQuestionsCount(this.questionsCount()));
  readonly description = input.required<string>();
  readonly score = input<number | null>();
  readonly inProgress = input<boolean>();

  readonly badgeRewardLevel = computed(() => {
    const s = this.score();

    return typeof s === 'number' ? computeRewardLevel(s) : null;
  });
  readonly badgeRewardLevelColor = computed(() =>
    computeBadgeRewardLevelColor(this.badgeRewardLevel()),
  );
}
