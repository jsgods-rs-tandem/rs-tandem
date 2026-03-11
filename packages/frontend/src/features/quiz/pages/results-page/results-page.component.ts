import { Component, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { ButtonComponent } from '@/shared/ui';
import { LayoutComponent } from '../layout';

import { countProgressPercentage, computeRewardLevel } from '../../utilities';

import { REWARD_PRAISE } from '../../constants';

import mock from '../../data/results.json';

@Component({
  selector: 'app-results-page',
  imports: [ButtonComponent, DecimalPipe, LayoutComponent],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.scss',
  standalone: true,
})
export class ResultsPageComponent {
  readonly links = mock.results.links;

  readonly progressInPercentage = computed(() => countProgressPercentage(mock.results.progress));
  readonly heading = computed(() => REWARD_PRAISE[computeRewardLevel(this.progressInPercentage())]);
}
