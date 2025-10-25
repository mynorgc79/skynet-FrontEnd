import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitasListComponent } from './pages/visitas-list.component';
import { roleGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: VisitasListComponent
  },
  {
    path: 'nueva',
    loadComponent: () => import('./components/visita-form.component').then(m => m.VisitaFormComponent),
    canActivate: [roleGuard],
    data: { roles: ['ADMINISTRADOR', 'SUPERVISOR'] }
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./components/visita-form.component').then(m => m.VisitaFormComponent),
    canActivate: [roleGuard],
    data: { roles: ['ADMINISTRADOR', 'SUPERVISOR'] }
  },
  {
    path: ':id',
    loadComponent: () => import('./components/visita-detail.component').then(m => m.VisitaDetailComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitasRoutingModule { }