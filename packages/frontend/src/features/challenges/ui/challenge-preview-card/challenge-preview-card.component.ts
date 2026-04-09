import { Component, computed, input } from '@angular/core';

import { BadgeComponent, ButtonComponent } from '@/shared/ui';
import { TagComponent } from '../tag';

import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

import { computeDifficultyBadgeColor } from './challenge-preview-card.utilities';

import { DIFFICULTY_TRANSLATION_KEYS } from './challenge-preview-card.constants';

import type { ChallengeTag } from '@rs-tandem/shared';
import type { Difficulty } from './challenge-preview-card.types';

@Component({
  selector: 'app-challenge-preview-card',
  imports: [BadgeComponent, ButtonComponent, TagComponent, TypedTranslocoPipe],
  templateUrl: './challenge-preview-card.component.html',
  styleUrl: './challenge-preview-card.component.scss',
  standalone: true,
})
export class ChallengePreviewCardComponent {
  readonly id = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly difficulty = input.required<Difficulty>();
  readonly tags = input<ChallengeTag[]>([]);
  readonly inProgress = input.required<boolean>();
  readonly isComplete = input.required<boolean>();

  protected readonly _badgeDifficultyColor = computed(() =>
    computeDifficultyBadgeColor(this.difficulty()),
  );
  protected readonly _difficultyTranslationKey = computed(
    () => DIFFICULTY_TRANSLATION_KEYS[this.difficulty()],
  );
}
