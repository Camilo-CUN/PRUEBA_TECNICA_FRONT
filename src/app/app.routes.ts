import { Routes } from '@angular/router';

export const routes: Routes = [
{
  path: 'admin',
  loadComponent: () => import('./Admin/pages/admin-users-page/admin-users-page.component'),
  canActivate: ['authGuard'],
  children:[]
},
{
  path: 'products',
  loadComponent: () => import('./products/pages/products-page/products-page.component'),
  canActivate: ['authGuard'],
  children:[]
},
{
  path: 'login',
  loadComponent: () => import('./Auth/pages/auth-page/auth-page.component'),
  children:[]
},
{
  path: '**',
  redirectTo: '/login',
  pathMatch: 'full'
}

];
