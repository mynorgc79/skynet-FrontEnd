import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>Detalle del Usuario</h2>
      <p class="text-muted">Componente en desarrollo...</p>
      <button class="btn btn-secondary" onclick="history.back()">
        <i class="fas fa-arrow-left me-2"></i>Volver
      </button>
    </div>
  `
})
export class UsuarioDetailComponent {
  
}