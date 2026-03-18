import { HomeComponent } from '@/pages/home/home.component';
import { Routes } from '@angular/router';
import { SignInComponent } from '@/pages/sign-in/sign-in.component';
import { SignUpComponent } from '@/pages/sign-up/sign-up.component';
import { LibraryComponent } from '@/pages/library';
import { ROUTES } from '@/core/constants';

import {
  CategoriesPageComponent as ChallengesCategoriesPageComponent,
  CategoryPageComponent as ChallengesCategoryPageComponent,
} from '@/features/challenges';

import {
  CategoriesPageComponent as QuizCategoriesPageComponent,
  CategoryPageComponent as QuizCategoryPageComponent,
  QuizPageComponent,
  ResultsPageComponent,
  categoryBreadcrumbResolver,
  topicBreadcrumbResolver,
} from '@/features/quiz';

import { authGuard } from '@/core/guards';
import { NotFoundComponent } from '@/pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: ROUTES.home,
    component: HomeComponent,
    canActivate: [authGuard],
    data: { layout: { mode: 'login', sidebar: true, auth: false } },
  },
  {
    path: ROUTES.signIn,
    component: SignInComponent,
    canActivate: [authGuard],
    data: { layout: { mode: 'home', sidebar: false, auth: false } },
  },
  {
    path: ROUTES.signUp,
    component: SignUpComponent,
    canActivate: [authGuard],
    data: { layout: { mode: 'home', sidebar: false, auth: false } },
  },
  {
    path: ROUTES.library,
    component: LibraryComponent,
    canActivate: [authGuard],
    data: { layout: { mode: 'logout', sidebar: true, auth: true } },
  },
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
      {
        path: ROUTES.challengesCategory,
        data: { breadcrumb: 'Category' },
        children: [
          {
            path: '',
            data: { breadcrumb: null },
            component: ChallengesCategoryPageComponent,
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.quiz,
    data: { layout: { mode: 'logout', sidebar: true, auth: true }, breadcrumb: 'Quiz' },
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
            component: QuizCategoryPageComponent,
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
  {
    path: ROUTES.notFound,
    component: NotFoundComponent,
    data: { layout: { mode: 'home', sidebar: false, auth: false } },
  },
  { path: ROUTES.wildcard, redirectTo: ROUTES.notFound },
];
