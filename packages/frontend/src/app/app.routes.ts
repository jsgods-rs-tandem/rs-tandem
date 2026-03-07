import { Routes } from '@angular/router';
import { SignUpComponent } from '@/pages/sign-up/sign-up.component';
import { SignInComponent } from '@/pages/sign-in/sign-in.component';

export const routes: Routes = [
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
