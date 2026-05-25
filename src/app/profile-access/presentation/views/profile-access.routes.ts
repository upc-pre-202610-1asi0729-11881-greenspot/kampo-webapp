import { Routes } from '@angular/router';

export const PROFILE_ACCESS_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login-form/login-form').then(m => m.LoginFormComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./registration-form/registration-form').then(m => m.RegistrationFormComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
