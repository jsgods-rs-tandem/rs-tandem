import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

import { environment } from '@/environments/environment';

import { ModalService } from '@/core/services/modal.service';
import { getHttpErrorMessage } from '@/shared/utils/http-error.utilities';
import { injectTranslate } from '@/shared/utils/translate.utilities';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import type { AppTranslationKey } from '@/shared/types/translation-keys';

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
  private readonly _http = inject(HttpClient);
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
      .get<GetCategoriesResponseDto>(`${environment.apiUrl}/quiz/categories`)
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
      .get<GetCategoryResponseDto>(`${environment.apiUrl}/quiz/categories/${id}`)
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
      .get<GetTopicResponseDto>(`${environment.apiUrl}/quiz/topics/${id}`)
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
      .get<GetResultsResponseDto>(`${environment.apiUrl}/quiz/results/${topicId}`)
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

  private _showError(error: CustomHttpError) {
    const errorMessage = getHttpErrorMessage(error);
    const translateKey = (message: string) => this._t(marker(message as AppTranslationKey));
    const translatedMessage = Array.isArray(errorMessage)
      ? errorMessage.map(translateKey)
      : translateKey(errorMessage);

    this._modalService.open({
      title: `${String(error.error.statusCode || 0)} — ${error.error.error || 'Network Error'}`,
      message: translatedMessage,
      icon: 'info-outline',
    });
  }
}
