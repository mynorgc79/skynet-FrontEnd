import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Routing
import { ClientesRoutingModule } from './clientes-routing.module';

// Components
import { ClientesListComponent } from './pages/clientes-list.component';

@NgModule({
  declarations: [
    ClientesListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ClientesRoutingModule
  ]
})
export class ClientesModule { }