import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitasListComponent } from './pages/visitas-list.component';

const routes: Routes = [
  {
    path: '',
    component: VisitasListComponent
  },
  {
    path: 'nueva',
    loadComponent: () => import('./components/visita-form.component').then(m => m.VisitaFormComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./components/visita-form.component').then(m => m.VisitaFormComponent)
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