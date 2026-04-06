import { Component, computed, effect, inject, input, type OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { LayoutComponent } from '@/pages/layout';
import { ButtonComponent, EmptyComponent } from '@/shared/ui';

import { QuizService } from '../../services';

import { computeRewardLevel } from '../../utilities';

import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

import { ROUTE_PATHS } from '@/core/constants';
import { REWARD_PRAISE } from '../../constants';

import type { AppTranslationKey } from '@/shared/types/translation-keys';

@Component({
  selector: 'app-results-page',
  imports: [ButtonComponent, DecimalPipe, EmptyComponent, LayoutComponent, TypedTranslocoPipe],
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

  readonly headingKey = computed<AppTranslationKey>(
    () => REWARD_PRAISE[computeRewardLevel(this.quizService.results()?.score ?? 0)],
  );
}
