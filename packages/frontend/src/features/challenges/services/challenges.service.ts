import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
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
import { isAppTranslationKey, type AppTranslationKey } from '@/shared/types/translation-keys';
import type { State } from './challenges.types';

@Injectable({ providedIn: 'root' })
export class ChallengesService {
  private static readonly _backendErrorMessageMap: Record<string, AppTranslationKey> = {
    'Validation failed (uuid is expected)': 'errors.validation.uuid_expected',
  };

  private readonly _http = inject(HttpClient);
  private readonly _transloco = inject(TranslocoService);
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
      .get<GetChallengeCategoriesResponseDto>(`${environment.apiUrl}/challenges/categories`, {
        headers: {
          'Accept-Language': this._transloco.getActiveLang(),
        },
      })
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
      .get<GetChallengeCategoryResponseDto>(`${environment.apiUrl}/challenges/categories/${id}`, {
        headers: {
          'Accept-Language': this._transloco.getActiveLang(),
        },
      })
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
      .get<GetChallengeTopicResponseDto>(`${environment.apiUrl}/challenges/topics/${id}`, {
        headers: {
          'Accept-Language': this._transloco.getActiveLang(),
        },
      })
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
        {
          headers: {
            'Accept-Language': this._transloco.getActiveLang(),
          },
        },
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
              title: this._t(marker('challenges.modals.solutionCompleted.title')),
              message: this._t(marker('challenges.modals.solutionCompleted.message')),
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
    const errorMessage = this._getErrorMessage(error);
    const translateKey = (message: AppTranslationKey) => this._t(marker(message));
    const translatedMessage = Array.isArray(errorMessage)
      ? errorMessage.map(translateKey)
      : translateKey(errorMessage);

    this._modalService.open({
      title: `${String(error.error.statusCode || 0)} — ${this._getErrorTitle(error)}`,
      message: translatedMessage,
    });
  }

  private _getErrorTitle(error: CustomHttpError): string {
    if (error.status === 400 || error.error.error === 'Bad Request') {
      return this._t(marker('errors.common.badRequestTitle'));
    }

    return error.error.error || this._t(marker('errors.common.networkTitle'));
  }

  private _getErrorMessage(error: HttpErrorResponse): AppTranslationKey | AppTranslationKey[] {
    if (error.status === 0 || error.status >= 500) {
      return getHttpErrorMessage(error);
    }

    const backendMessage = this._extractBackendMessage(error);

    if (!backendMessage) {
      return 'errors.common.unexpected';
    }

    if (Array.isArray(backendMessage)) {
      const mappedMessages = backendMessage
        .map((message) => this._mapBackendMessageToTranslationKey(message))
        .filter((message): message is AppTranslationKey => message !== null);

      return mappedMessages.length > 0 ? mappedMessages : 'errors.common.unexpected';
    }

    return this._mapBackendMessageToTranslationKey(backendMessage) ?? 'errors.common.unexpected';
  }

  private _extractBackendMessage(error: HttpErrorResponse): string | string[] | null {
    if (!error.error || typeof error.error !== 'object' || !('message' in error.error)) {
      return null;
    }

    const { message } = error.error as { message?: unknown };

    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message)) {
      return message.filter((item): item is string => typeof item === 'string');
    }

    return null;
  }

  private _mapBackendMessageToTranslationKey(message: string): AppTranslationKey | null {
    const mappedMessage = ChallengesService._backendErrorMessageMap[message];

    if (mappedMessage) {
      return mappedMessage;
    }

    const directKey = `errors.${message}` as AppTranslationKey;

    return isAppTranslationKey(directKey) ? directKey : null;
  }
}
