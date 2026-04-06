import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { marker } from '@jsverse/transloco-keys-manager/marker';

import { environment } from '@/environments/environment';

import { ModalService } from '@/core/services/modal.service';

import { getHttpErrorMessage } from '@/shared/utils/http-error.utilities';
import { injectTranslate } from '@/shared/utils/translate.utilities';

import { ROUTE_PATHS } from '@/core/constants';

import type {
  GetChallengeCategoriesResponseDto,
  GetChallengeCategoryResponseDto,
  GetChallengeTopicResponseDto,
  UpdateChallengeStatusResponseDto,
} from '@rs-tandem/shared';
import type { CustomHttpError } from '@/shared/types';
import type { AppTranslationKey } from '@/shared/types/translation-keys';
import type { State } from './challenges.types';

@Injectable({ providedIn: 'root' })
export class ChallengesService {
  private readonly _http = inject(HttpClient);
  private readonly _modalService = inject(ModalService);
  private readonly _router = inject(Router);
  private readonly _t = injectTranslate();

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
      solution: false,
    },
  });

  readonly categories = computed(() => this._state().data.categories);
  readonly category = computed(() => this._state().data.category);
  readonly codeEditor = computed(() => this._state().data.codeEditor);

  readonly loading = computed(() => this._state().loading);

  reloadPage() {
    window.location.reload();
  }

  getCategories() {
    this._state.update((state) => ({
      ...state,
      data: { ...state.data, categories: [] },
      loading: { ...state.loading, categories: true },
    }));

    this._http
      .get<GetChallengeCategoriesResponseDto>(`${environment.apiUrl}/challenges/categories`)
      .pipe(
        finalize(() => {
          this._state.update((state) => ({
            ...state,
            loading: { ...state.loading, categories: false },
          }));
        }),
      )
      .subscribe({
        next: (data) => {
          this._state.update((state) => ({
            ...state,
            data: { ...state.data, categories: data.categories },
          }));
        },
        error: (error: CustomHttpError) => {
          this._showError(error);
        },
      });
  }

  getCategory(id: string) {
    this._state.update((state) => ({
      ...state,
      data: { ...state.data, category: null },
      loading: { ...state.loading, category: true },
    }));

    this._http
      .get<GetChallengeCategoryResponseDto>(`${environment.apiUrl}/challenges/categories/${id}`)
      .pipe(
        finalize(() => {
          this._state.update((state) => ({
            ...state,
            loading: { ...state.loading, category: false },
          }));
        }),
      )
      .subscribe({
        next: (data) => {
          this._state.update((state) => ({ ...state, data: { ...state.data, category: data } }));
        },
        error: (error: CustomHttpError) => {
          this._showError(error);
        },
      });
  }

  getCodeEditor(id: string) {
    this._state.update((state) => ({
      ...state,
      data: { ...state.data, codeEditor: null },
      loading: { ...state.loading, codeEditor: true },
    }));

    this._http
      .get<GetChallengeTopicResponseDto>(`${environment.apiUrl}/challenges/topics/${id}`)
      .pipe(
        finalize(() => {
          this._state.update((state) => ({
            ...state,
            loading: { ...state.loading, codeEditor: false },
          }));
        }),
      )
      .subscribe({
        next: (data) => {
          this._state.update((state) => ({ ...state, data: { ...state.data, codeEditor: data } }));
        },
        error: (error: CustomHttpError) => {
          this._showError(error);
        },
      });
  }

  postTopicStatus(categoryId: string, topicId: string, status: 'inProgress' | 'completed') {
    this._state.update((state) => ({
      ...state,
      loading: { ...state.loading, solution: true },
    }));

    this._http
      .post<UpdateChallengeStatusResponseDto>(
        `${environment.apiUrl}/challenges/topics/${topicId}`,
        { status },
      )
      .pipe(
        finalize(() => {
          this._state.update((state) => ({
            ...state,
            loading: { ...state.loading, solution: false },
          }));
        }),
      )
      .subscribe({
        next: () => {
          if (status === 'completed') {
            this._modalService.open({
              title: 'Well done!',
              message: 'The task is complete. Try other challenges',
              icon: 'check-circle',
              onClose: () => {
                void this._router.navigate([`${ROUTE_PATHS.challenges}/${categoryId}`]);
              },
            });
          }
        },
        error: (error: CustomHttpError) => {
          this._showError(error);
        },
      });
  }

  resetCategories() {
    this._state.update((state) => ({
      ...state,
      data: {
        ...state.data,
        categories: [],
      },
    }));
  }

  resetCategory() {
    this._state.update((state) => ({
      ...state,
      data: {
        ...state.data,
        category: null,
      },
    }));
  }

  resetCodeEditor() {
    this._state.update((state) => ({
      ...state,
      data: {
        ...state.data,
        codeEditor: null,
      },
    }));
  }

  private _showError(error: CustomHttpError) {
    const errorMessage = getHttpErrorMessage(error);
    const translateKey = (message: string) => this._t(marker(message as AppTranslationKey));
    const translatedMessage = Array.isArray(errorMessage)
      ? errorMessage.map(translateKey)
      : translateKey(errorMessage);

    this._modalService.open({
      title: `${String(error.error.statusCode || 0)} — ${error.error.error || 'Network Error'}`,
      message: translatedMessage,
    });
  }
}
