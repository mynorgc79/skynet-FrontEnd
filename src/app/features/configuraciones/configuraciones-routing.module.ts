import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionesDashboardComponent } from './pages/configuraciones-dashboard.component';
import { ConfiguracionCategoriaComponent } from './components/configuracion-categoria.component';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionesDashboardComponent
  },
  {
    path: 'categoria/:categoria',
    component: ConfiguracionCategoriaComponent
  },
  {
    path: 'logs',
    loadComponent: () => import('./components/index').then(m => m.LogsAuditoriaComponent)
  },
  {
    path: 'respaldos',
    loadComponent: () => import('./components/index').then(m => m.RespaldosComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionesRoutingModule { }