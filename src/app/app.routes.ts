import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Rentals } from './components/rentals/rentals';
import { AdminLogin } from './components/admin-login/admin-login';
import { AdminRentals } from './components/admin-rentals/admin-rentals';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'rentals',
    component: Rentals,
  },
  {
    path: 'admin/login',
    component: AdminLogin,
  },
  {
    path: 'admin/rentals',
    component: AdminRentals,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
