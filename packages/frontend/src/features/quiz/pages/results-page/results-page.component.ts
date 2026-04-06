import { Component, computed, effect, inject, input, type OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { LayoutComponent } from '@/pages/layout';
import { ButtonComponent, EmptyComponent } from '@/shared/ui';

import { QuizService } from '../../services';

import { computeRewardLevel } from '../../utilities';

import { ROUTE_PATHS } from '@/core/constants';
import { REWARD_PRAISE } from '../../constants';

@Component({
  selector: 'app-results-page',
  imports: [ButtonComponent, DecimalPipe, EmptyComponent, LayoutComponent],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.scss',
  standalone: true,
})
export class ResultsPageComponent implements OnInit {
  readonly quizService = inject(QuizService);

  readonly categoryId = input.required<string>();
  readonly topicId = input.required<string>();

  readonly ROUTE_PATHS = ROUTE_PATHS;

  constructor() {
    effect((onCleanup) => {
      onCleanup(() => {
        this.quizService.resetResults();
      });
    });
  }

  ngOnInit(): void {
    this.quizService.getResults(this.topicId());
  }

  readonly heading = computed(
    () => REWARD_PRAISE[computeRewardLevel(this.quizService.results()?.score ?? 0)],
  );
}
