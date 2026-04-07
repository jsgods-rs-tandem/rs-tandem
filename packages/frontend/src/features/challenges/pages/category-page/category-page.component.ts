import { Component, computed, effect, inject, input, signal, type OnInit } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';

import { LayoutComponent } from '@/pages/layout';
import {
  ButtonComponent,
  EmptyComponent,
  ProgressComponent,
  SelectComponent,
  type SelectOption,
} from '@/shared/ui';
import { ChallengePreviewCardComponent } from '../../ui';

import { ChallengesService } from '../../services';

import { injectActiveLang, injectTranslate } from '@/shared/utils/translate.utilities';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

import type { AppTranslationKey } from '@/shared/types/translation-keys';
import type { Filters } from './category-page.types';

@Component({
  selector: 'app-category-page',
  imports: [
    ButtonComponent,
    ChallengePreviewCardComponent,
    EmptyComponent,
    LayoutComponent,
    ProgressComponent,
    SelectComponent,
    TypedTranslocoPipe,
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  standalone: true,
})
export class CategoryPageComponent implements OnInit {
  readonly categoryId = input.required<string>();

  protected readonly _challengesService = inject(ChallengesService);

  private readonly _activeLang = injectActiveLang();
  private readonly _t = injectTranslate();
  private _isInitialLangEffectRun = true;

  constructor() {
    effect(
      () => {
        this._activeLang();
        const categoryId = this.categoryId();

        if (this._isInitialLangEffectRun) {
          this._isInitialLangEffectRun = false;
          return;
        }

        this._challengesService.getCategory(categoryId);
      },
      { allowSignalWrites: true },
    );

    effect((onCleanup) => {
      onCleanup(() => {
        this._challengesService.resetCategory();
      });
    });
  }

  ngOnInit(): void {
    if (!this._challengesService.category()) {
      const categoryId = this.categoryId();

      this._challengesService.getCategory(categoryId);
    }
  }

  protected _topics = computed(() => {
    const topics = this._challengesService.category()?.topics ?? [];
    const filters = this._filtersValues();

    return topics.reduce<typeof topics>((acc, topic) => {
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(topic.difficulty)) {
        return acc;
      }

      if (filters.tags.length > 0 && !topic.tags.some((tag) => filters.tags.includes(tag))) {
        return acc;
      }

      if (filters.status.length > 0 && !filters.status.includes(topic.status)) {
        return acc;
      }

      acc.push(topic);
      return acc;
    }, []);
  });

  protected _difficultyFilter = computed(() => {
    this._activeLang();

    return this._computeFilterOptions([
      {
        text: 'challenges.category.previewCard.difficulty.easy',
        value: 'easy',
      },
      {
        text: 'challenges.category.previewCard.difficulty.medium',
        value: 'medium',
      },
      {
        text: 'challenges.category.previewCard.difficulty.hard',
        value: 'hard',
      },
    ]);
  });

  protected _tagsFilter = computed(() => {
    const category = this._challengesService.category();
    const tags = new Set<string>();

    category?.topics.forEach((topic) => {
      topic.tags.forEach((tag) => {
        tags.add(tag);
      });
    });

    return Array.from(tags)
      .map((tag) => ({
        text: tag,
        value: tag,
      }))
      .sort((a, b) => a.text.localeCompare(b.text));
  });

  protected _statusFilter = computed(() => {
    this._activeLang();

    return this._computeFilterOptions([
      { text: 'challenges.category.previewCard.badges.notStarted', value: 'notStarted' },
      { text: 'challenges.category.previewCard.badges.inProgress', value: 'inProgress' },
      { text: 'challenges.category.previewCard.badges.done', value: 'completed' },
    ]);
  });

  protected _filtersValues = signal<Filters>({
    difficulty: [],
    tags: [],
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
      difficulty: [],
      tags: [],
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
