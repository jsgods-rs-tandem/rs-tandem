import { HomeComponent } from '@/pages/home/home.component';
import { Routes } from '@angular/router';
import { SignInComponent } from '@/pages/sign-in/sign-in.component';
import { SignUpComponent } from '@/pages/sign-up/sign-up.component';
import { LibraryComponent } from '@/pages/library';
import { ROUTES } from '@/core/constants';

import { CategoriesPageComponent as ChallengesCategoriesPageComponent } from '@/features/challenges';

import {
  CategoriesPageComponent as QuizCategoriesPageComponent,
  CategoryPageComponent,
  QuizPageComponent,
  ResultsPageComponent,
  categoryBreadcrumbResolver,
  topicBreadcrumbResolver,
} from '@/features/quiz';

import { authGuard } from '@/core/guards';

export const routes: Routes = [
  { path: ROUTES.home, component: HomeComponent, canActivate: [authGuard] },
  { path: ROUTES.signIn, component: SignInComponent, canActivate: [authGuard] },
  { path: ROUTES.signUp, component: SignUpComponent, canActivate: [authGuard] },
  { path: ROUTES.library, component: LibraryComponent, canActivate: [authGuard] },
  {
    path: ROUTES.challenges,
    data: { breadcrumb: 'Challenges' },
    canActivate: [authGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: null },
        component: ChallengesCategoriesPageComponent,
      },
    ],
  },
  {
    path: ROUTES.quiz,
    data: { breadcrumb: 'Quiz' },
    canActivate: [authGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: null },
        component: QuizCategoriesPageComponent,
      },
      {
        path: ROUTES.quizCategory,
        resolve: { breadcrumb: categoryBreadcrumbResolver },
        children: [
          {
            path: '',
            data: { breadcrumb: null },
            component: CategoryPageComponent,
          },
          {
            path: ROUTES.quizTopic,
            resolve: { breadcrumb: topicBreadcrumbResolver },
            children: [
              {
                path: '',
                data: { breadcrumb: null },
                component: QuizPageComponent,
              },
              {
                path: ROUTES.quizResults,
                data: { breadcrumb: 'Results' },
                component: ResultsPageComponent,
              },
            ],
          },
        ],
      },
    ],
  },
  { path: ROUTES.notFound, redirectTo: '' },
];
