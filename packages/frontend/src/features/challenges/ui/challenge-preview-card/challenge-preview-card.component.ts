import { Component, computed, input } from '@angular/core';

import { BadgeComponent, ButtonComponent } from '@/shared/ui';
import { TagComponent } from '../tag';

import { computeDifficultyBadgeColor } from './challenge-preview-card.utilities';

@Component({
  selector: 'app-challenge-preview-card',
  imports: [BadgeComponent, ButtonComponent, TagComponent],
  templateUrl: './challenge-preview-card.component.html',
  styleUrl: './challenge-preview-card.component.scss',
  standalone: true,
})
export class ChallengePreviewCardComponent {
  readonly id = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly difficulty = input.required<string>();
  readonly tags = input<string[]>([]);
  readonly inProgress = input.required<boolean>();
  readonly isComplete = input.required<boolean>();

  readonly badgeDifficultyColor = computed(() => computeDifficultyBadgeColor(this.difficulty()));
}
