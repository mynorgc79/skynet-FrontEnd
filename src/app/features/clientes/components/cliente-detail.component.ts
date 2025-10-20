import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-detail',
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
                Detalle del Cliente
              </h5>
            </div>
            <div class="card-body">
              <p class="text-muted">Componente en desarrollo...</p>
              <p>Este detalle incluirá:</p>
              <ul class="text-muted">
                <li>Información completa del cliente</li>
                <li>Mapa interactivo con la ubicación</li>
                <li>Historial de visitas</li>
                <li>Botones para acciones rápidas</li>
                <li>Datos de contacto y empresa</li>
              </ul>
              <div class="d-flex gap-2">
                <button class="btn btn-secondary" onclick="history.back()">
                  <i class="fas fa-arrow-left me-2"></i>Volver
                </button>
                <button class="btn btn-primary">
                  <i class="fas fa-edit me-2"></i>Editar Cliente
                </button>
                <button class="btn btn-success">
                  <i class="fas fa-calendar-plus me-2"></i>Nueva Visita
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Ubicación</h6>
            </div>
            <div class="card-body text-center">
              <div class="map-detail">
                <i class="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
                <p class="text-muted">Mapa del cliente</p>
                <button class="btn btn-outline-primary btn-sm">
                  <i class="fas fa-external-link-alt me-1"></i>
                  Abrir en Google Maps
                </button>
              </div>
            </div>
          </div>
          
          <div class="card mt-3">
            <div class="card-header">
              <h6 class="mb-0">Visitas Recientes</h6>
            </div>
            <div class="card-body">
              <p class="text-muted text-center">
                <i class="fas fa-calendar-alt fa-2x mb-2"></i><br>
                Historial de visitas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-detail {
      min-height: 200px;
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      background: #f8f9fa;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
  `]
})
export class ClienteDetailComponent {
  
}