import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Routing
import { UsuariosRoutingModule } from './usuarios-routing.module';

// Components
import { UsuariosListComponent } from './pages/usuarios-list.component';
import { UsuarioDetailComponent } from './components/usuario-detail.component';

@NgModule({
  declarations: [
    UsuariosListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UsuariosRoutingModule,
    UsuarioDetailComponent // Standalone component
  ]
})
export class UsuariosModule { }