import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfiguracionesRoutingModule } from './configuraciones-routing.module';
import { ConfiguracionesDashboardComponent } from './pages/configuraciones-dashboard.component';

@NgModule({
  declarations: [
    ConfiguracionesDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfiguracionesRoutingModule
  ]
})
export class ConfiguracionesModule { }