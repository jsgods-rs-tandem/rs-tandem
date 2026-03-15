import { Component, input, computed } from '@angular/core';

import { ButtonComponent } from '@/shared/ui';
import { BadgeComponent } from '../../../badge/badge.component';

import { computeQuestionsCount } from './topic-card.utilities';

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
  readonly status = input<ReturnType<BadgeComponent['status']>>();
}
