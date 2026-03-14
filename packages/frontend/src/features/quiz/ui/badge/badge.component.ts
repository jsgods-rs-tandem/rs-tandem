import { Component, input, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { PopoverComponent } from '../popover/popover.component';

import { computeProgressStatus, computeRewardLevel } from '../../utilities';

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

  readonly status = input<'progress'>();
  readonly score = input<number>();
  readonly level = computed(() => {
    const s = this.score();

    return s ? computeRewardLevel(s) : null;
  });
  readonly progressStatus = computed(() => computeProgressStatus(this.status() ?? ''));
}
