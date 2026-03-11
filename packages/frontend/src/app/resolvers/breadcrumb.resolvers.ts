import type { ResolveFn } from '@angular/router';

import categories from '@/features/quiz/data/categories.json';
import category from '@/features/quiz/data/category.json';

export const categoryBreadcrumbResolver: ResolveFn<string> = (route) => {
  const categoryId = route.paramMap.get('id');
  const name = categoryId ? categories.categories.find((c) => c.id === categoryId)?.name : '';

  return name ?? 'Category';
};

export const topicBreadcrumbResolver: ResolveFn<string> = (route) => {
  const topicId = route.paramMap.get('id');
  const name = topicId ? category.topics.find((t) => t.id === topicId)?.name : '';

  return name ?? 'Topic';
};
