import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ClientesListComponent } from './pages/clientes-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClientesListComponent,
    data: { title: 'Clientes' }
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./components/cliente-form.component').then(c => c.ClienteFormComponent),
    data: { title: 'Nuevo Cliente' }
  },
  {
    path: ':id',
    loadComponent: () => import('./components/cliente-detail.component').then(c => c.ClienteDetailComponent),
    data: { title: 'Detalle Cliente' }
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./components/cliente-form.component').then(c => c.ClienteFormComponent),
    data: { title: 'Editar Cliente' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }