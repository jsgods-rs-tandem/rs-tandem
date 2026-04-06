import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, skipWhile, take } from 'rxjs';

import { ChallengesService } from '../services';

export const categoryBreadcrumbResolver: ResolveFn<string> = (route) => {
  const challengesService = inject(ChallengesService);
  const categoryId = route.paramMap.get('categoryId');

  if (!categoryId) {
    return 'breadcrumbs.category';
  }

  challengesService.getCategory(categoryId);

  const loadingCategory$ = toObservable(challengesService.loading).pipe(
    map((loading) => loading.category),
    distinctUntilChanged(),
  );

  return loadingCategory$.pipe(
    skipWhile((isLoading) => !isLoading),
    filter((isLoading) => !isLoading),
    take(1),
    map(() => {
      const category = challengesService.category();

      return category?.id === categoryId ? category.name : 'breadcrumbs.category';
    }),
  );
};

export const topicBreadcrumbResolver: ResolveFn<string> = (route) => {
  const challengesService = inject(ChallengesService);
  const topicId = route.paramMap.get('topicId');

  if (!topicId) {
    return 'breadcrumbs.topic';
  }

  challengesService.getCodeEditor(topicId);

  const loadingTopic$ = toObservable(challengesService.loading).pipe(
    map((loading) => loading.codeEditor),
    distinctUntilChanged(),
  );

  return loadingTopic$.pipe(
    skipWhile((isLoading) => !isLoading),
    filter((isLoading) => !isLoading),
    take(1),
    map(() => {
      const topic = challengesService.codeEditor();

      return topic?.id === topicId ? topic.name : 'breadcrumbs.topic';
    }),
  );
};
