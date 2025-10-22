import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './pages/dashboard-layout.component';
import { DashboardComponent } from './pages/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      // Módulos específicos
      {
        path: 'usuarios',
        loadChildren: () => import('../usuarios/usuarios.module').then(m => m.UsuariosModule)
      },
      {
        path: 'clientes',
        loadChildren: () => import('../clientes/clientes.module').then(m => m.ClientesModule)
      },
      {
        path: 'visitas',
        loadChildren: () => import('../visitas/visitas.module').then(m => m.VisitasModule)
      },
      {
        path: 'configuraciones',
        loadChildren: () => import('../configuraciones/configuraciones.module').then(m => m.ConfiguracionesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }