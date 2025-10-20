import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>Formulario de Usuario</h2>
      <p class="text-muted">Componente en desarrollo...</p>
      <button class="btn btn-secondary" onclick="history.back()">
        <i class="fas fa-arrow-left me-2"></i>Volver
      </button>
    </div>
  `
})
export class UsuarioFormComponent {
  
}