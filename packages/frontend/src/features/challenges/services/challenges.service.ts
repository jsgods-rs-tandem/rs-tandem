import { Injectable, computed, signal } from '@angular/core';

import categoriesMock from '../data/categories.json';
import categoryMock from '../data/topics-js-core.json';
import codeEditorMock from '../data/topic-core-map.json';

import type { State } from './challenges.types';

@Injectable({ providedIn: 'root' })
export class ChallengesService {
  private readonly _state = signal<State>({
    data: {
      categories: [],
      category: null,
      codeEditor: null,
    },
    loading: {
      categories: false,
      category: false,
      codeEditor: false,
    },
  });

  readonly categories = computed(() => this._state().data.categories);
  readonly category = computed(() => this._state().data.category);
  readonly codeEditor = computed(() => this._state().data.codeEditor);

  readonly loading = computed(() => this._state().loading);

  getCategories() {
    this._state.update((state) => ({
      ...state,
      data: { ...state.data, categories: [] },
      loading: { ...state.loading, categories: true },
    }));

    this._state.update((state) => ({
      ...state,
      data: { ...state.data, categories: categoriesMock },
    }));

    this._state.update((state) => ({
      ...state,
      loading: { ...state.loading, categories: false },
    }));
  }

  getCategory() {
    this._state.update((state) => ({
      ...state,
      data: { ...state.data, category: null },
      loading: { ...state.loading, category: true },
    }));

    this._state.update((state) => ({ ...state, data: { ...state.data, category: categoryMock } }));

    this._state.update((state) => ({
      ...state,
      loading: { ...state.loading, category: false },
    }));
  }

  getCodeEditor() {
    this._state.update((state) => ({
      ...state,
      data: { ...state.data, codeEditor: null },
      loading: { ...state.loading, codeEditor: true },
    }));

    this._state.update((state) => ({
      ...state,
      data: { ...state.data, codeEditor: codeEditorMock },
    }));

    this._state.update((state) => ({
      ...state,
      loading: { ...state.loading, codeEditor: false },
    }));
  }
}
