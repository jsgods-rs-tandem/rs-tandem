import { Component, computed, inject, input, type OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { ButtonComponent } from '@/shared/ui';
import { LayoutComponent } from '../layout';

import { QuizService } from '../../services';

import { computeRewardLevel } from '../../utilities';

import { REWARD_PRAISE } from '../../constants';

@Component({
  selector: 'app-results-page',
  imports: [ButtonComponent, DecimalPipe, LayoutComponent],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.scss',
  standalone: true,
})
export class ResultsPageComponent implements OnInit {
  readonly quizService = inject(QuizService);

  readonly topicId = input.required<string>();

  ngOnInit(): void {
    this.quizService.getResults(this.topicId());
  }

  readonly heading = computed(
    () => REWARD_PRAISE[computeRewardLevel(this.quizService.results()?.score ?? 0)],
  );
}
