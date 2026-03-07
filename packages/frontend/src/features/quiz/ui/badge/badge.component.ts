import { Component, input, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { computeRewardLevel } from './badge.utilities';

@Component({
  selector: 'app-badge',
  imports: [TitleCasePipe],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  standalone: true,
})
export class BadgeComponent {
  readonly score = input.required<number>();
  readonly level = computed(() => computeRewardLevel(this.score()));
}
