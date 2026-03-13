import type { ResolveFn } from '@angular/router';

// Переделать после доработки бэка
export const categoryBreadcrumbResolver: ResolveFn<string> = () => {
  return 'Category';

  // const categoryId = route.paramMap.get('categoryId');
  // const name = categoryId ? categories.categories.find((c) => c.id === categoryId)?.name : '';

  // return name ?? 'Category';
};

export const topicBreadcrumbResolver: ResolveFn<string> = () => {
  return 'Topic';
  // const topicId = route.paramMap.get('topicId');
  // const name = topicId ? category.topics.find((t) => t.id === topicId)?.name : '';

  // return name ?? 'Topic';
};
