import { Component, input, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { PopoverComponent } from '../popover/popover.component';

import { computeRewardLevel } from './badge.utilities';

@Component({
  selector: 'app-badge',
  imports: [TitleCasePipe, PopoverComponent],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  standalone: true,
})
export class BadgeComponent {
  readonly id = crypto.randomUUID();
  readonly anchorId = crypto.randomUUID();

  readonly score = input.required<number>();
  readonly level = computed(() => computeRewardLevel(this.score()));
}
