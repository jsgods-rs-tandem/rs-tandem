import { HomeComponent } from '@/pages/home/home.component';
import { Routes } from '@angular/router';
import { SignInComponent } from '@/pages/sign-in/sign-in.component';
import { SignUpComponent } from '@/pages/sign-up/sign-up.component';
import { LibraryComponent } from '@/pages/library';

import {
  CategoriesPageComponent,
  CategoryPageComponent,
  QuizPageComponent,
  ResultsPageComponent,
  categoryBreadcrumbResolver,
  topicBreadcrumbResolver,
} from '@/features/quiz';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'library', component: LibraryComponent },
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
        path: ':categoryId',
        resolve: { breadcrumb: categoryBreadcrumbResolver },
        children: [
          {
            path: '',
            data: { breadcrumb: null },
            component: CategoryPageComponent,
          },
          {
            path: 'topic/:topicId',
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
