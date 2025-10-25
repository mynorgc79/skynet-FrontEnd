import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from '../services/clientes.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Cliente } from '@core/interfaces';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <!-- Loading indicator -->
      <div *ngIf="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Cliente Detail -->
      <div *ngIf="!loading && cliente" class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-building me-2"></i>
                {{ cliente.nombre }}
                <span 
                  class="badge ms-2"
                  [class]="cliente.activo ? 'bg-success' : 'bg-danger'">
                  {{ cliente.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </h5>
            </div>
            <div class="card-body">
              <!-- Información básica -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <h6 class="text-muted mb-3">Información de Contacto</h6>
                  <div class="info-item mb-2">
                    <i class="fas fa-user me-2 text-primary"></i>
                    <strong>Contacto:</strong> {{ cliente.contacto }}
                  </div>
                  <div class="info-item mb-2">
                    <i class="fas fa-phone me-2 text-primary"></i>
                    <strong>Teléfono:</strong> 
                    <a [href]="'tel:' + cliente.telefono" class="text-decoration-none">
                      {{ cliente.telefono || 'No registrado' }}
                    </a>
                  </div>
                  <div class="info-item mb-2">
                    <i class="fas fa-envelope me-2 text-primary"></i>
                    <strong>Email:</strong> 
                    <a [href]="'mailto:' + cliente.email" class="text-decoration-none">
                      {{ cliente.email }}
                    </a>
                  </div>
                  <div class="info-item mb-2">
                    <i class="fas fa-tag me-2 text-primary"></i>
                    <strong>Tipo:</strong> {{ cliente.tipoCliente }}
                  </div>
                </div>
                <div class="col-md-6">
                  <h6 class="text-muted mb-3">Ubicación</h6>
                  <div class="info-item mb-2">
                    <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                    <strong>Dirección:</strong> {{ cliente.direccion }}
                  </div>
                  <div class="info-item mb-2">
                    <i class="fas fa-globe me-2 text-primary"></i>
                    <strong>Coordenadas:</strong> {{ cliente.latitud }}, {{ cliente.longitud }}
                  </div>
                  <div class="info-item mb-2">
                    <i class="fas fa-calendar me-2 text-primary"></i>
                    <strong>Creado:</strong> {{ formatDate(cliente.fechaCreacion) }}
                  </div>
                  <div class="info-item mb-2">
                    <i class="fas fa-clock me-2 text-primary"></i>
                    <strong>Actualizado:</strong> {{ formatDate(cliente.fechaActualizacion) }}
                  </div>
                </div>
              </div>

              <!-- Botón de acción único -->
              <div class="d-flex gap-2">
                <button 
                  class="btn btn-secondary"
                  (click)="volver()">
                  <i class="fas fa-arrow-left me-2"></i>Volver a la lista
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <!-- Mapa -->
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-map me-2"></i>
                Ubicación
              </h6>
            </div>
            <div class="card-body text-center">
              <div class="map-detail">
                <i class="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
                <p class="text-muted">{{ cliente.direccion }}</p>
                <p class="small text-muted">
                  Lat: {{ cliente.latitud }}<br>
                  Lng: {{ cliente.longitud }}
                </p>
                <a 
                  [href]="getGoogleMapsUrl()"
                  target="_blank"
                  class="btn btn-outline-primary btn-sm">
                  <i class="fas fa-external-link-alt me-1"></i>
                  Abrir en Google Maps
                </a>
              </div>
            </div>
          </div>
          
          <!-- Visitas Recientes -->
          <div class="card mt-3">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-calendar-alt me-2"></i>
                Historial de Visitas
              </h6>
            </div>
            <div class="card-body">
              <div *ngIf="loadingVisitas" class="text-center">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Cargando visitas...</span>
                </div>
              </div>

              <div *ngIf="!loadingVisitas && historialVisitas.length === 0" class="text-center text-muted">
                <i class="fas fa-calendar-alt fa-2x mb-2"></i><br>
                <p>No hay visitas registradas</p>
                <small class="text-muted">
                  Use el botón "Planificar visita" en la lista de clientes para crear la primera visita
                </small>
              </div>

              <div *ngIf="!loadingVisitas && historialVisitas.length > 0">
                <div *ngFor="let visita of historialVisitas.slice(0, 5)" class="visita-item mb-2">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="grow">
                      <div class="fw-medium">{{ visita.motivo }}</div>
                      <small class="text-muted">
                        {{ formatDate(visita.fechaVisita) }} 
                        <span *ngIf="visita.estado" class="badge badge-sm ms-1" 
                              [class]="getEstadoBadgeClass(visita.estado)">
                          {{ visita.estado }}
                        </span>
                      </small>
                    </div>
                  </div>
                </div>
                
                <div class="text-center mt-3" *ngIf="historialVisitas.length > 5">
                  <button class="btn btn-sm btn-outline-secondary">
                    Ver todas las visitas ({{ historialVisitas.length }})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div *ngIf="!loading && !cliente" class="text-center py-5">
        <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
        <h5 class="text-muted">Cliente no encontrado</h5>
        <p class="text-muted">El cliente que buscas no existe o ha sido eliminado</p>
        <button class="btn btn-primary" (click)="volver()">
          <i class="fas fa-arrow-left me-2"></i>Volver a la lista
        </button>
      </div>
    </div>
  `,
  styles: [`
    .info-item {
      line-height: 1.6;
    }
    
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

    .visita-item {
      padding: 10px;
      border: 1px solid #e9ecef;
      border-radius: 5px;
      background: #f8f9fa;
    }

    .badge-sm {
      font-size: 0.7em;
    }

    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
  `]
})
export class ClienteDetailComponent implements OnInit {
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientesService = inject(ClientesService);
  private toastService = inject(ToastService);

  cliente: Cliente | null = null;
  historialVisitas: any[] = [];
  loading = false;
  loadingVisitas = false;
  clienteId: number = 0;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clienteId = +params['id'];
      if (this.clienteId) {
        this.cargarCliente();
        this.cargarHistorialVisitas();
      }
    });
  }

  cargarCliente(): void {
    this.loading = true;
    this.clientesService.getById(this.clienteId).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al cargar el cliente');
        this.loading = false;
        console.error('Error loading cliente:', error);
      }
    });
  }

  cargarHistorialVisitas(): void {
    this.loadingVisitas = true;
    this.clientesService.getHistorialVisitas(this.clienteId).subscribe({
      next: (visitas) => {
        this.historialVisitas = visitas;
        this.loadingVisitas = false;
      },
      error: (error) => {
        console.error('Error loading historial visitas:', error);
        this.historialVisitas = [];
        this.loadingVisitas = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/dashboard/clientes']);
  }

  getGoogleMapsUrl(): string {
    if (!this.cliente) return '#';
    return `https://www.google.com/maps?q=${this.cliente.latitud},${this.cliente.longitud}`;
  }

  // Utility methods
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'completada':
        return 'bg-success';
      case 'en_progreso':
        return 'bg-warning';
      case 'programada':
        return 'bg-primary';
      case 'cancelada':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}