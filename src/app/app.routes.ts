import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Shalala Homes — Windsor Property Management' },
  {
    path: 'rentals',
    loadComponent: () => import('./components/rentals/rentals').then(m => m.Rentals),
    title: 'Rentals — Shalala Homes',
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-login/admin-login').then(m => m.AdminLogin),
    title: 'Admin — Shalala Homes',
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [authGuard],
    title: 'Manage Rentals — Shalala Homes',
  },
  { path: '**', redirectTo: '' },
];
