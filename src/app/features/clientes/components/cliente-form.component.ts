import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-building me-2"></i>
                Formulario de Cliente
              </h5>
            </div>
            <div class="card-body">
              <p class="text-muted">Componente en desarrollo...</p>
              <p>Este formulario incluirá:</p>
              <ul class="text-muted">
                <li>Datos personales del cliente</li>
                <li>Información de la empresa</li>
                <li>Selector de ubicación con Google Maps</li>
                <li>Validaciones de coordenadas GPS</li>
                <li>Autocompletado de direcciones</li>
              </ul>
              <button class="btn btn-secondary" onclick="history.back()">
                <i class="fas fa-arrow-left me-2"></i>Volver
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Vista Previa del Mapa</h6>
            </div>
            <div class="card-body text-center">
              <div class="map-preview">
                <i class="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
                <p class="text-muted">Google Maps se mostrará aquí</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-preview {
      min-height: 200px;
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      background: #f8f9fa;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class ClienteFormComponent {
  
}