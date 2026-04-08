import { Component, computed, effect, inject, input, type OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgxParticlesModule, NgParticlesService } from '@tsparticles/angular';
import { loadConfettiPreset } from '@tsparticles/preset-confetti';

import { LayoutComponent } from '@/pages/layout';
import { ButtonComponent, EmptyComponent } from '@/shared/ui';

import { QuizService } from '../../services';

import { computeRewardLevel } from '../../utilities';

import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

import { ROUTE_PATHS } from '@/core/constants';
import { particlesOptions } from './results-page.constants';
import { REWARD_PRAISE } from '../../constants';

import type { AppTranslationKey } from '@/shared/types/translation-keys';

@Component({
  selector: 'app-results-page',
  imports: [
    ButtonComponent,
    DecimalPipe,
    EmptyComponent,
    LayoutComponent,
    NgxParticlesModule,
    TypedTranslocoPipe,
  ],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.scss',
  standalone: true,
})
export class ResultsPageComponent implements OnInit {
  readonly quizService = inject(QuizService);

  readonly categoryId = input.required<string>();
  readonly topicId = input.required<string>();

  readonly ROUTE_PATHS = ROUTE_PATHS;
  readonly headingKey = computed<AppTranslationKey>(
    () => REWARD_PRAISE[computeRewardLevel(this.quizService.results()?.score ?? 0)],
  );

  protected readonly _id = 'tsparticles';
  protected readonly _particlesOptions = particlesOptions;
  protected readonly _ngParticlesService: NgParticlesService;

  constructor(ngParticlesService: NgParticlesService) {
    this._ngParticlesService = ngParticlesService;

    effect((onCleanup) => {
      onCleanup(() => {
        this.quizService.resetResults();
      });
    });
  }

  ngOnInit(): void {
    this.quizService.getResults(this.topicId());

    void this._ngParticlesService.init(async (engine) => {
      await loadConfettiPreset(engine);
    });
  }
}
