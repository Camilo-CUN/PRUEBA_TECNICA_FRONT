import { Routes } from '@angular/router';

export const routes: Routes = [
{
  path: 'dashboard',
  loadComponent: () => import('./Dashboard/pages/HistoricoPage/HistoricoPage.component'),
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
