import { HomeComponent } from '@/pages/home/home.component';
import { Routes } from '@angular/router';
import { SignInComponent } from '@/pages/sign-in/sign-in.component';
import { SignUpComponent } from '@/pages/sign-up/sign-up.component';

import {
  CategoriesPageComponent,
  CategoryPageComponent,
  QuizPageComponent,
  ResultsPageComponent,
} from '@/features/quiz/pages';

import {
  categoryBreadcrumbResolver,
  topicBreadcrumbResolver,
} from './resolvers/breadcrumb.resolvers';

export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '', component: HomeComponent },

  {
    path: 'quiz',
    data: { breadcrumb: 'Quiz' },
    children: [
      {
        path: '',
        data: { breadcrumb: null },
        component: CategoriesPageComponent,
      },
      {
        path: ':id',
        resolve: { breadcrumb: categoryBreadcrumbResolver },
        children: [
          {
            path: '',
            data: { breadcrumb: null },
            component: CategoryPageComponent,
          },
          {
            path: 'topic/:id',
            resolve: { breadcrumb: topicBreadcrumbResolver },
            children: [
              {
                path: '',
                data: { breadcrumb: null },
                component: QuizPageComponent,
              },
              {
                path: 'results',
                data: { breadcrumb: 'Results' },
                component: ResultsPageComponent,
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
