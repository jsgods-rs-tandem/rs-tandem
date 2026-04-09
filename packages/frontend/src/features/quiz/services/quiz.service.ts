import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { environment } from '@/environments/environment';

import { ModalService } from '@/core/services/modal.service';
import { getHttpErrorMessage } from '@/shared/utils/http-error.utilities';
import { injectTranslate } from '@/shared/utils/translate.utilities';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';

import { isAppTranslationKey, type AppTranslationKey } from '@/shared/types/translation-keys';
import type {
  GetCategoriesResponseDto,
  GetCategoryResponseDto,
  GetTopicResponseDto,
  GetResultsResponseDto,
  StartTopicResponseDto,
  SubmitAnswerRequestDto,
  SubmitAnswerResponseDto,
} from '@rs-tandem/shared';
import type { CustomHttpError } from '@/shared/types';
import type { QuizState } from './quiz.types';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private static readonly _backendErrorMessageMap: Record<string, AppTranslationKey> = {
    'Validation failed (uuid is expected)': 'errors.validation.uuid_expected',
  };

  private readonly _http = inject(HttpClient);
  private readonly _transloco = inject(TranslocoService);
  private readonly _modalService = inject(ModalService);
  private readonly _t = injectTranslate();

  private readonly _state = signal<QuizState>({
    data: {
      categories: [],
      category: null,
      topic: null,
      step: 0,
      answer: null,
      results: null,
    },
    loading: {
      categories: false,
      category: false,
      topic: false,
      step: false,
      answer: false,
      results: false,
    },
  });

  readonly categories = computed(() => this._state().data.categories);
  readonly category = computed(() => this._state().data.category);
  readonly topic = computed(() => this._state().data.topic);
  readonly step = computed(() => this._state().data.step);

  readonly currentQuestion = computed(() => {
    const { topic, step } = this._state().data;

    if (!topic) {
      return null;
    }

    return topic.questions.at(step) ?? null;
  });
  readonly answer = computed(() => this._state().data.answer);
  readonly results = computed(() => this._state().data.results);

  readonly loading = computed(() => this._state().loading);

  setNextStep() {
    const currentTopic = this.topic();

    if (!currentTopic) {
      return;
    }

    const nextStep = this.step() + 1;

    if (nextStep >= currentTopic.questionsCount) {
      return;
    }

    this._state.update((state) => ({
      ...state,
      data: { ...state.data, step: state.data.step + 1, answer: null },
    }));
  }

  reloadPage() {
    window.location.reload();
  }

  getCategories() {
    this._state.update((state) => ({
      ...state,
      loading: { ...state.loading, categories: true },
    }));

    this._http
      .get<GetCategoriesResponseDto>(`${environment.apiUrl}/quiz/categories`, {
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
      .get<GetCategoryResponseDto>(`${environment.apiUrl}/quiz/categories/${id}`, {
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

  getTopic(id: string) {
    this._state.update((state) => ({
      ...state,
      data: { ...state.data, topic: null },
      loading: { ...state.loading, topic: true },
    }));

    this._http
      .get<GetTopicResponseDto>(`${environment.apiUrl}/quiz/topics/${id}`, {
        headers: {
          'Accept-Language': this._transloco.getActiveLang(),
        },
      })
      .pipe(
        finalize(() => {
          this._state.update((state) => ({
            ...state,
            loading: { ...state.loading, topic: false },
          }));
        }),
      )
      .subscribe({
        next: (data) => {
          this._state.update((state) => ({ ...state, data: { ...state.data, topic: data } }));
        },
        error: (error: CustomHttpError) => {
          this._showError(error);
        },
      });
  }

  startTopic(id: string) {
    this._state.update((state) => ({
      ...state,
      loading: { ...state.loading, step: true },
    }));

    this._http
      .post<StartTopicResponseDto>(`${environment.apiUrl}/quiz/topics/${id}/start`, null)
      .pipe(
        finalize(() => {
          this._state.update((state) => ({
            ...state,
            loading: { ...state.loading, step: false },
          }));
        }),
      )
      .subscribe({
        next: (data) => {
          this._state.update((state) => ({
            ...state,
            data: { ...state.data, step: data.step },
          }));
        },
        error: (error: CustomHttpError) => {
          this._showError(error);
        },
      });
  }

  answerQuestion(topicId: string, questionId: string, body: SubmitAnswerRequestDto) {
    this._state.update((state) => ({
      ...state,
      loading: { ...state.loading, answer: true },
    }));

    this._http
      .put<SubmitAnswerResponseDto>(
        `${environment.apiUrl}/quiz/topics/${topicId}/questions/${questionId}`,
        body,
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
            loading: { ...state.loading, answer: false },
          }));
        }),
      )
      .subscribe({
        next: (data) => {
          this._state.update((state) => ({
            ...state,
            data: { ...state.data, answer: data },
          }));
        },
        error: (error: CustomHttpError) => {
          this._showError(error);
        },
      });
  }

  getResults(topicId: string) {
    this._state.update((state) => ({
      ...state,
      data: { ...state.data, answer: null },
      loading: { ...state.loading, results: true },
    }));

    this._http
      .get<GetResultsResponseDto>(`${environment.apiUrl}/quiz/results/${topicId}`, {
        headers: {
          'Accept-Language': this._transloco.getActiveLang(),
        },
      })
      .pipe(
        finalize(() => {
          this._state.update((state) => ({
            ...state,
            loading: { ...state.loading, results: false },
          }));
        }),
      )
      .subscribe({
        next: (data) => {
          this._state.update((state) => ({
            ...state,
            data: { ...state.data, results: data.results },
          }));
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

  resetTopic() {
    this._state.update((state) => ({
      ...state,
      data: {
        ...state.data,
        topic: null,
      },
    }));
  }

  resetResults() {
    this._state.update((state) => ({
      ...state,
      data: {
        ...state.data,
        results: null,
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
      icon: 'info-outline',
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
    const mappedMessage = QuizService._backendErrorMessageMap[message];

    if (mappedMessage) {
      return mappedMessage;
    }

    const directKey = `errors.${message}` as AppTranslationKey;

    return isAppTranslationKey(directKey) ? directKey : null;
  }
}
