import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, skipWhile, take } from 'rxjs';

import { QuizService } from '../services';

export const categoryBreadcrumbResolver: ResolveFn<string> = (route) => {
  const quizService = inject(QuizService);
  const categoryId = route.paramMap.get('categoryId');

  if (!categoryId) {
    return 'breadcrumbs.category';
  }

  quizService.getCategory(categoryId);

  const loadingCategory$ = toObservable(quizService.loading).pipe(
    map((loading) => loading.category),
    distinctUntilChanged(),
  );

  return loadingCategory$.pipe(
    skipWhile((isLoading) => !isLoading),
    filter((isLoading) => !isLoading),
    take(1),
    map(() => {
      const category = quizService.category();

      return category?.id === categoryId ? category.name : 'breadcrumbs.category';
    }),
  );
};

export const topicBreadcrumbResolver: ResolveFn<string> = (route) => {
  const quizService = inject(QuizService);
  const topicId = route.paramMap.get('topicId');

  if (!topicId) {
    return 'breadcrumbs.topic';
  }

  quizService.getTopic(topicId);

  const loadingTopic$ = toObservable(quizService.loading).pipe(
    map((loading) => loading.topic),
    distinctUntilChanged(),
  );

  return loadingTopic$.pipe(
    skipWhile((isLoading) => !isLoading),
    filter((isLoading) => !isLoading),
    take(1),
    map(() => {
      const topic = quizService.topic();

      return topic?.id === topicId ? topic.name : 'breadcrumbs.topic';
    }),
  );
};
