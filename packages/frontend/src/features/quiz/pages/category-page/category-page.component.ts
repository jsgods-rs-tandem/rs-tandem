import { Component, computed, effect, inject, input, signal, type OnInit } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';

import {
  ButtonComponent,
  EmptyComponent,
  ProgressComponent,
  SelectComponent,
  type SelectOption,
} from '@/shared/ui';
import { LayoutComponent } from '@/pages/layout';
import { TopicCardListComponent } from '../../ui';

import { QuizService } from '../../services';

import { injectActiveLang, injectTranslate } from '@/shared/utils/translate.utilities';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

import { computeRewardLevel } from '../../utilities';

import { REWARD_LEVEL } from '../../constants';

import type { AppTranslationKey } from '@/shared/types/translation-keys';
import type { Filters } from './category-page.types';

@Component({
  selector: 'app-category-page',
  host: {
    'collision-id': 'quiz-category-page',
  },
  imports: [
    ButtonComponent,
    EmptyComponent,
    LayoutComponent,
    ProgressComponent,
    SelectComponent,
    TopicCardListComponent,
    TypedTranslocoPipe,
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  standalone: true,
})
export class CategoryPageComponent implements OnInit {
  readonly categoryId = input.required<string>();

  protected readonly _quizService = inject(QuizService);

  private readonly _activeLang = injectActiveLang();
  private readonly _t = injectTranslate();

  constructor() {
    effect((onCleanup) => {
      onCleanup(() => {
        this._quizService.resetCategory();
      });
    });
  }

  ngOnInit(): void {
    if (!this._quizService.category()) {
      const categoryId = this.categoryId();

      this._quizService.getCategory(categoryId);
    }
  }

  protected _topics = computed(() => {
    const topics = this._quizService.category()?.topics ?? [];
    const { achievements, status } = this._filtersValues();

    return topics.reduce<typeof topics>((acc, topic) => {
      const { score } = topic;

      if (status.length > 0) {
        if (topic.inProgress) {
          if (!status.includes('inProgress')) {
            return acc;
          }
        } else if (score === null && !status.includes('notStarted')) {
          return acc;
        }

        if (!topic.inProgress && typeof score === 'number' && !status.includes('completed')) {
          return acc;
        }
      }

      if (achievements.length > 0) {
        if (typeof score !== 'number') {
          return acc;
        }

        if (!achievements.includes(computeRewardLevel(score))) {
          return acc;
        }
      }

      acc.push(topic);
      return acc;
    }, []);
  });

  protected _achievementsFilter = computed(() => {
    this._activeLang();

    return this._computeFilterOptions([
      { text: 'quiz.topicCard.badges.level.senior', value: REWARD_LEVEL.senior },
      { text: 'quiz.topicCard.badges.level.middle', value: REWARD_LEVEL.middle },
      { text: 'quiz.topicCard.badges.level.junior', value: REWARD_LEVEL.junior },
      { text: 'quiz.topicCard.badges.level.trainee', value: REWARD_LEVEL.trainee },
    ]);
  });

  protected _statusFilter = computed(() => {
    this._activeLang();

    return this._computeFilterOptions([
      { text: 'quiz.topicCard.badges.notStarted', value: 'notStarted' },
      { text: 'quiz.topicCard.badges.inProgress', value: 'inProgress' },
      { text: 'quiz.topicCard.badges.done', value: 'completed' },
    ]);
  });

  protected _filtersValues = signal<Filters>({
    achievements: [],
    status: [],
  });

  protected _onFilterChange(type: keyof Filters, selectedOptionValues: string[]) {
    this._filtersValues.update((previousState) => ({
      ...previousState,
      [type]: selectedOptionValues,
    }));
  }

  protected _onFiltersReset() {
    this._filtersValues.set({
      achievements: [],
      status: [],
    });
  }

  private _computeFilterOptions(options: SelectOption[]) {
    return options.map(({ text, value }) => ({
      text: this._t(marker(text as AppTranslationKey)),
      value,
    }));
  }
}
