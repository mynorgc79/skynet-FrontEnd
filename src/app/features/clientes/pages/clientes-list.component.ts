import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../services/clientes.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Cliente, ClienteFilter } from '@core/interfaces';

@Component({
  selector: 'app-clientes-list',
  standalone: false,
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">Gestión de Clientes</h2>
              <p class="text-muted mb-0">Administrar clientes y ubicaciones</p>
            </div>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-outline-primary"
                (click)="toggleMapView()">
                <i [class]="showMapView ? 'fas fa-list' : 'fas fa-map-marked-alt'"></i>
                {{ showMapView ? 'Vista Lista' : 'Vista Mapa' }}
              </button>
              <button 
                class="btn btn-primary"
                (click)="crearCliente()">
                <i class="fas fa-plus me-2"></i>
                Nuevo Cliente
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Buscar por nombre</label>
              <input 
                type="text" 
                class="form-control"
                placeholder="Nombre, apellido o empresa..."
                [(ngModel)]="filters.nombre"
                (input)="applyFilters()">
            </div>
            <div class="col-md-2">
              <label class="form-label">Contacto</label>
              <input 
                type="text" 
                class="form-control"
                placeholder="Buscar contacto..."
                [(ngModel)]="filters.contacto"
                (input)="applyFilters()">
            </div>
            <div class="col-md-2">
              <label class="form-label">Tipo de Cliente</label>
              <select 
                class="form-select"
                [(ngModel)]="filters.tipoCliente"
                (change)="applyFilters()">
                <option value="">Todos los tipos</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="CORPORATIVO">Corporativo</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select 
                class="form-select"
                [(ngModel)]="filterStatus"
                (change)="applyStatusFilter()">
                <option value="">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
            <div class="col-md-3 d-flex align-items-end gap-2">
              <button 
                class="btn btn-outline-secondary"
                (click)="limpiarFiltros()">
                <i class="fas fa-eraser me-2"></i>
                Limpiar
              </button>
              <button 
                class="btn btn-outline-info"
                (click)="exportarClientes()">
                <i class="fas fa-download me-2"></i>
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Mapa -->
      <div *ngIf="showMapView" class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-map-marked-alt me-2"></i>
            Mapa de Clientes
          </h5>
        </div>
        <div class="card-body">
          <div class="map-container">
            <div class="map-placeholder">
              <div class="text-center py-5">
                <i class="fas fa-map fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Google Maps</h5>
                <p class="text-muted">Aquí se integrará Google Maps para mostrar las ubicaciones de los clientes</p>
                <div class="row g-2 mt-3">
                  <div class="col-md-6" *ngFor="let cliente of clientesFiltrados.slice(0, 4)">
                    <div class="card border-primary">
                      <div class="card-body p-2">
                        <small class="fw-bold">{{ cliente.nombre }} - {{ cliente.contacto }}</small><br>
                        <small class="text-muted">{{ cliente.tipoCliente }}</small><br>
                        <small class="text-primary">
                          📍 {{ cliente.direccion }}
                        </small>
                        <button 
                          class="btn btn-sm btn-outline-primary float-end"
                          (click)="abrirEnMaps(cliente)">
                          <i class="fas fa-external-link-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Lista -->
      <div *ngIf="!showMapView" class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-building me-2"></i>
            Clientes ({{ clientesFiltrados.length }})
          </h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Cliente</th>
                  <th>Empresa</th>
                  <th>Contacto</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Última actualización</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cliente of clientesFiltrados; trackBy: trackByCliente">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar-circle me-3">
                        {{ getInitials(cliente.nombre, cliente.contacto) }}
                      </div>
                      <div>
                        <div class="fw-semibold">{{ cliente.nombre }} - {{ cliente.contacto }}</div>
                        <small class="text-muted">ID: {{ cliente.idCliente }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div class="fw-medium">{{ cliente.tipoCliente || 'No especificado' }}</div>
                      <small class="text-muted">{{ cliente.email }}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>{{ cliente.telefono || 'No registrado' }}</div>
                      <small class="text-muted">{{ cliente.email }}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div class="fw-medium">{{ cliente.direccion }}</div>
                      <small class="text-muted">Coords: {{ cliente.latitud }}, {{ cliente.longitud }}</small>
                      <div class="mt-1">
                        <button 
                          class="btn btn-sm btn-outline-primary"
                          (click)="abrirEnMaps(cliente)"
                          title="Ver en Google Maps">
                          <i class="fas fa-map-marker-alt me-1"></i>
                          Ver ubicación
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      class="badge"
                      [class]="cliente.activo ? 'bg-success' : 'bg-danger'">
                      {{ cliente.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td>
                    <small class="text-muted">
                      {{ formatDate(cliente.fechaActualizacion) }}
                    </small>
                  </td>
                  <td class="text-center">
                    <div class="btn-group btn-group-sm">
                      <button 
                        class="btn btn-outline-primary"
                        (click)="verCliente(cliente.idCliente)"
                        title="Ver detalles">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-outline-warning"
                        (click)="editarCliente(cliente.idCliente)"
                        title="Editar">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="btn btn-outline-info"
                        (click)="planificarVisita(cliente.idCliente)"
                        title="Planificar visita">
                        <i class="fas fa-calendar-plus"></i>
                      </button>
                      <button 
                        class="btn"
                        [class]="cliente.activo ? 'btn-outline-danger' : 'btn-outline-success'"
                        (click)="toggleClienteStatus(cliente)"
                        [title]="cliente.activo ? 'Desactivar' : 'Activar'">
                        <i [class]="cliente.activo ? 'fas fa-ban' : 'fas fa-check'"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div *ngIf="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && clientesFiltrados.length === 0" class="text-center py-5">
        <i class="fas fa-building fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No se encontraron clientes</h5>
        <p class="text-muted">Intenta ajustar los filtros o crear un nuevo cliente</p>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
    }
    
    .table th {
      font-weight: 600;
      border-bottom: 2px solid #dee2e6;
    }
    
    .btn-group-sm .btn {
      padding: 0.25rem 0.5rem;
    }
    
    .badge {
      font-size: 0.75em;
    }
    
    .map-container {
      min-height: 400px;
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      background: #f8f9fa;
    }
    
    .map-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 400px;
    }
  `]
})
export class ClientesListComponent implements OnInit {
  
  private clientesService = inject(ClientesService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  loading = false;
  showMapView = false;
  
  filters: ClienteFilter = {};
  filterStatus: string = '';
  
  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.clientesService.getAll().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.clientesFiltrados = [...clientes];
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al cargar clientes');
        this.loading = false;
        console.error('Error loading clients:', error);
      }
    });
  }

  applyFilters(): void {
    this.loading = true;
    this.clientesService.getAll(this.filters).subscribe({
      next: (clientes) => {
        this.clientesFiltrados = clientes;
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al filtrar clientes');
        this.loading = false;
      }
    });
  }

  applyStatusFilter(): void {
    if (this.filterStatus !== '') {
      this.filters.activo = this.filterStatus === 'true';
    } else {
      delete this.filters.activo;
    }
    this.applyFilters();
  }

  limpiarFiltros(): void {
    this.filters = {};
    this.filterStatus = '';
    this.clientesFiltrados = [...this.clientes];
  }

  toggleMapView(): void {
    this.showMapView = !this.showMapView;
  }

  crearCliente(): void {
    this.router.navigate(['/dashboard/clientes/nuevo']);
  }

  verCliente(id: number): void {
    this.router.navigate(['/dashboard/clientes', id]);
  }

  editarCliente(id: number): void {
    this.router.navigate(['/dashboard/clientes', id, 'editar']);
  }

  planificarVisita(clienteId: number): void {
    this.router.navigate(['/dashboard/visitas/nueva'], { 
      queryParams: { clienteId } 
    });
  }

  abrirEnMaps(cliente: Cliente): void {
    const url = this.clientesService.getGoogleMapsUrl(cliente);
    window.open(url, '_blank');
  }

  toggleClienteStatus(cliente: Cliente): void {
    const action = cliente.activo ? 'desactivar' : 'activar';
    
    this.clientesService.toggleStatus(cliente.idCliente).subscribe({
      next: (updatedCliente: Cliente) => {
        const index = this.clientes.findIndex(c => c.idCliente === cliente.idCliente);
        if (index !== -1) {
          this.clientes[index] = updatedCliente;
          this.applyFilters(); // Refresh filtered list
        }
        this.toastService.showSuccess(`Cliente ${action}do correctamente`);
      },
      error: (error: any) => {
        this.toastService.showError(`Error al ${action} cliente`);
        console.error(`Error toggling client status:`, error);
      }
    });
  }

  exportarClientes(): void {
    // Implementar exportación (CSV, Excel, etc.)
    this.toastService.showInfo('Funcionalidad de exportación en desarrollo');
  }

  // Utility methods
  trackByCliente(index: number, cliente: Cliente): number {
    return cliente.idCliente;
  }

  getInitials(nombre: string, contacto: string): string {
    return (nombre.charAt(0) + contacto.charAt(0)).toUpperCase();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}