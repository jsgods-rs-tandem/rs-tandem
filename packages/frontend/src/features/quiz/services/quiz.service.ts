import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

import { environment } from '@/environments/environment';

import type {
  GetCategoriesResponseDto,
  GetCategoryResponseDto,
  GetTopicResponseDto,
  GetResultsResponseDto,
  StartTopicResponseDto,
  SubmitAnswerRequestDto,
  SubmitAnswerResponseDto,
  QuizCategorySummary,
  QuizCategory,
} from '@rs-tandem/shared';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly _http = inject(HttpClient);

  private readonly _state = signal<{
    data: {
      categories: QuizCategorySummary[];
      category: QuizCategory | null;
      topic: GetTopicResponseDto | null;
      step: number;
      answer: SubmitAnswerResponseDto | null;
      results: GetResultsResponseDto['results'] | null;
    };
    loading: {
      categories: boolean;
      category: boolean;
      topic: boolean;
      step: boolean;
      answer: boolean;
      results: boolean;
    };
    error: {
      categories: string;
      category: string;
      topic: string;
      step: string;
      answer: string;
      results: string;
    };
  }>({
    data: {
      categories: [],
      category: null,
      topic: null,
      step: 0,
      answer: null,
      results: null,
    },
    // preparations for showing pending state of a page or button
    loading: {
      categories: false,
      category: false,
      topic: false,
      step: false,
      answer: false,
      results: false,
    },
    error: {
      categories: '',
      category: '',
      topic: '',
      step: '',
      answer: '',
      results: '',
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

  getCategories() {
    this._state.update((state) => ({
      ...state,
      loading: { ...state.loading, categories: true },
      error: { ...state.error, categories: '' },
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
        // Add correct types of error in future
        error: (error: string) => {
          this._state.update((state) => ({
            ...state,
            error: { ...state.error, categories: error },
          }));
        },
      });
  }

  getCategory(id: string) {
    this._state.update((state) => ({
      ...state,
      loading: { ...state.loading, category: true },
      error: { ...state.error, category: '' },
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
        error: (error: string) => {
          this._state.update((state) => ({
            ...state,
            error: { ...state.error, category: error },
          }));
        },
      });
  }

  getTopic(id: string) {
    this._state.update((state) => ({
      ...state,
      data: { ...state.data, topic: null },
      loading: { ...state.loading, topic: true },
      error: { ...state.error, topic: '' },
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
        error: (error: string) => {
          this._state.update((state) => ({
            ...state,
            error: { ...state.error, topic: error },
          }));
        },
      });
  }

  startTopic(id: string) {
    this._state.update((state) => ({
      ...state,
      loading: { ...state.loading, step: true },
      error: { ...state.error, step: '' },
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
        error: (error: string) => {
          this._state.update((state) => ({
            ...state,
            error: { ...state.error, step: error },
          }));
        },
      });
  }

  answerQuestion(topicId: string, questionId: string, body: SubmitAnswerRequestDto) {
    this._state.update((state) => ({
      ...state,
      loading: { ...state.loading, answer: true },
      error: { ...state.error, answer: '' },
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
        error: (error: string) => {
          this._state.update((state) => ({
            ...state,
            error: { ...state.error, answer: error },
          }));
        },
      });
  }

  getResults(topicId: string) {
    this._state.update((state) => ({
      ...state,
      data: { ...state.data, answer: null },
      loading: { ...state.loading, results: true },
      error: { ...state.error, results: '' },
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
        error: (error: string) => {
          this._state.update((state) => ({
            ...state,
            error: { ...state.error, results: error },
          }));
        },
      });
  }
}
