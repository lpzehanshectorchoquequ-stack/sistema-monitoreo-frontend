import { Routes } from '@angular/router';
import { authGuard } from './presentation/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./presentation/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./presentation/inicio/inicio.page').then((m) => m.InicioPage),
  },
  { path: '**', redirectTo: '' },
];