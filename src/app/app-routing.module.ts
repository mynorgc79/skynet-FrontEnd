import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // canActivate: [publicGuard],
    loadChildren: () => import('@features/public/public.module').then((m) => m.PublicModule),
  },
  {
    path: 'dashboard',
    // canActivate: [privateGuard],
    loadChildren: () => import('@features/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '404',
    loadComponent: () =>
      import('@shared/pages/index').then((c) => c.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
