import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { UsuariosListComponent } from './pages/usuarios-list.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosListComponent,
    data: { title: 'Usuarios' }
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./components/usuario-form.component').then(c => c.UsuarioFormComponent),
    data: { title: 'Nuevo Usuario' }
  },
  {
    path: ':id',
    loadComponent: () => import('./components/usuario-detail.component').then(c => c.UsuarioDetailComponent),
    data: { title: 'Detalle Usuario' }
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./components/usuario-form.component').then(c => c.UsuarioFormComponent),
    data: { title: 'Editar Usuario' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }