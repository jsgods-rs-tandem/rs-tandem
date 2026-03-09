import { HomeComponent } from '@/pages/home/home.component';
import { Routes } from '@angular/router';
import { SignInComponent } from '@/pages/sign-in/sign-in.component';
import { SignUpComponent } from '@/pages/sign-up/sign-up.component';

export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
