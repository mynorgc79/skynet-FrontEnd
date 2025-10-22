import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfiguracionService } from '../../../core/services/configuracion.service';
import { ToastService } from '../../../shared/services/toast.service';
import { 
  LogAuditoria, 
  LogAuditoriaFilter, 
  AccionAuditoria 
} from '@core/interfaces';

@Component({
  selector: 'app-logs-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">
                <i class="fas fa-history me-2"></i>
                Logs de Auditoría
              </h2>
              <p class="text-muted mb-0">Registro de actividades y cambios en el sistema</p>
            </div>
            <button 
              class="btn btn-outline-secondary"
              (click)="volver()">
              <i class="fas fa-arrow-left me-2"></i>
              Volver
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-2">
              <label class="form-label">Fecha desde</label>
              <input 
                type="date" 
                class="form-control"
                [(ngModel)]="fechaDesde"
                (change)="aplicarFiltros()">
            </div>
            <div class="col-md-2">
              <label class="form-label">Fecha hasta</label>
              <input 
                type="date" 
                class="form-control"
                [(ngModel)]="fechaHasta"
                (change)="aplicarFiltros()">
            </div>
            <div class="col-md-2">
              <label class="form-label">Entidad</label>
              <select 
                class="form-select"
                [(ngModel)]="filters.entidad"
                (change)="aplicarFiltros()">
                <option value="">Todas</option>
                <option value="usuario">Usuario</option>
                <option value="cliente">Cliente</option>
                <option value="visita">Visita</option>
                <option value="configuracion">Configuración</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Acción</label>
              <select 
                class="form-select"
                [(ngModel)]="filters.accion"
                (change)="aplicarFiltros()">
                <option value="">Todas</option>
                <option value="CREAR">Crear</option>
                <option value="ACTUALIZAR">Actualizar</option>
                <option value="ELIMINAR">Eliminar</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
                <option value="ACCESO_DENEGADO">Acceso Denegado</option>
              </select>
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button 
                class="btn btn-outline-secondary w-100"
                (click)="limpiarFiltros()">
                <i class="fas fa-eraser me-2"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="h4 mb-0">{{ estadisticas.total || 0 }}</div>
                  <div>Total Logs</div>
                </div>
                <i class="fas fa-list fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="h4 mb-0">{{ estadisticas.hoy || 0 }}</div>
                  <div>Hoy</div>
                </div>
                <i class="fas fa-calendar-day fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="h4 mb-0">{{ estadisticas.semana || 0 }}</div>
                  <div>Esta Semana</div>
                </div>
                <i class="fas fa-calendar-week fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="h4 mb-0">{{ estadisticas.usuarios || 0 }}</div>
                  <div>Usuarios Activos</div>
                </div>
                <i class="fas fa-users fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de logs -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-file-alt me-2"></i>
            Logs de Auditoría ({{ logsFiltrados.length }})
          </h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Fecha/Hora</th>
                  <th>Usuario</th>
                  <th>Entidad</th>
                  <th>Acción</th>
                  <th>Descripción</th>
                  <th>IP</th>
                  <th class="text-center">Detalles</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let log of logsFiltrados; trackBy: trackByLog">
                  <td>
                    <div class="fw-semibold">{{ formatDate(log.fechaCreacion) }}</div>
                    <small class="text-muted">{{ formatTime(log.fechaCreacion) }}</small>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar-circle me-2">
                        {{ getInitials(log.creadoPor) }}
                      </div>
                      <div>
                        <div class="fw-medium">Usuario #{{ log.creadoPor }}</div>
                        <small class="text-muted">{{ log.usuario?.email || 'N/A' }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [class]="'bg-' + getEntidadColor(log.entidad)">
                      {{ getEntidadLabel(log.entidad) }}
                    </span>
                    <div class="small text-muted">ID: {{ log.idEntidad }}</div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <i [class]="getAccionIcon(log.accion)" [ngClass]="getAccionColor(log.accion)"></i>
                      <span class="ms-2">{{ getAccionLabel(log.accion) }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="small">{{ log.descripcion }}</div>
                    <div *ngIf="log.valorAnterior && log.valorNuevo" class="mt-1">
                      <small class="text-muted">
                        <strong>Antes:</strong> {{ log.valorAnterior | slice:0:20 }}{{ log.valorAnterior.length > 20 ? '...' : '' }}<br>
                        <strong>Después:</strong> {{ log.valorNuevo | slice:0:20 }}{{ log.valorNuevo.length > 20 ? '...' : '' }}
                      </small>
                    </div>
                  </td>
                  <td>
                    <code class="small">{{ log.direccionIP }}</code>
                    <div class="small text-muted" *ngIf="log.userAgent">
                      {{ getUserAgentSummary(log.userAgent) }}
                    </div>
                  </td>
                  <td class="text-center">
                    <button 
                      class="btn btn-outline-primary btn-sm"
                      (click)="verDetalles(log)"
                      title="Ver detalles completos">
                      <i class="fas fa-eye"></i>
                    </button>
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
      <div *ngIf="!loading && logsFiltrados.length === 0" class="text-center py-5">
        <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No se encontraron logs</h5>
        <p class="text-muted">Intenta ajustar los filtros o el rango de fechas</p>
      </div>
    </div>

    <!-- Modal para detalles del log -->
    <div class="modal fade" id="modalDetalles" tabindex="-1" *ngIf="mostrarModal && logSeleccionado">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i [class]="getAccionIcon(logSeleccionado.accion)" class="me-2"></i>
              Detalles del Log #{{ logSeleccionado.id }}
            </h5>
            <button type="button" class="btn-close" (click)="cerrarModal()"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold">Fecha y Hora</label>
                <div>{{ formatDateTime(logSeleccionado.fechaCreacion) }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Usuario</label>
                <div>Usuario #{{ logSeleccionado.creadoPor }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Entidad</label>
                <div>{{ getEntidadLabel(logSeleccionado.entidad) }} (ID: {{ logSeleccionado.idEntidad }})</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Acción</label>
                <div>{{ getAccionLabel(logSeleccionado.accion) }}</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-bold">Descripción</label>
                <div>{{ logSeleccionado.descripcion }}</div>
              </div>
              <div class="col-md-6" *ngIf="logSeleccionado.valorAnterior">
                <label class="form-label fw-bold">Valor Anterior</label>
                <div class="bg-light p-2 rounded">
                  <code>{{ logSeleccionado.valorAnterior }}</code>
                </div>
              </div>
              <div class="col-md-6" *ngIf="logSeleccionado.valorNuevo">
                <label class="form-label fw-bold">Valor Nuevo</label>
                <div class="bg-light p-2 rounded">
                  <code>{{ logSeleccionado.valorNuevo }}</code>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Dirección IP</label>
                <div><code>{{ logSeleccionado.direccionIP }}</code></div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">User Agent</label>
                <div class="small">{{ logSeleccionado.userAgent }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="cerrarModal()">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table th {
      font-weight: 600;
      border-bottom: 2px solid #dee2e6;
    }
    
    .avatar-circle {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 0.75rem;
    }
    
    .opacity-75 {
      opacity: 0.75;
    }
    
    .modal {
      display: block;
      background-color: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class LogsAuditoriaComponent implements OnInit {
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private configuracionService = inject(ConfiguracionService);
  private toastService = inject(ToastService);

  logs: LogAuditoria[] = [];
  logsFiltrados: LogAuditoria[] = [];
  loading = false;
  mostrarModal = false;
  logSeleccionado: LogAuditoria | null = null;

  filters: LogAuditoriaFilter = {};
  fechaDesde: string = '';
  fechaHasta: string = '';

  estadisticas = {
    total: 0,
    hoy: 0,
    semana: 0,
    usuarios: 0
  };

  ngOnInit(): void {
    // Verificar parámetros de query para filtros específicos
    this.route.queryParams.subscribe(params => {
      if (params['entidad']) {
        this.filters.entidad = params['entidad'];
      }
      if (params['idEntidad']) {
        // Filtrar por entidad específica
        this.filters.entidad = params['entidad'];
      }
      if (params['accion']) {
        this.filters.accion = params['accion'];
      }
    });
    
    this.cargarLogs();
  }

  cargarLogs(): void {
    this.loading = true;
    this.configuracionService.getLogsAuditoria(this.filters).subscribe({
      next: (logs) => {
        this.logs = logs;
        this.calcularEstadisticas();
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al cargar logs de auditoría');
        this.loading = false;
        console.error('Error loading audit logs:', error);
      }
    });
  }

  aplicarFiltros(): void {
    let filtrados = [...this.logs];
    
    if (this.fechaDesde) {
      this.filters.fechaDesde = new Date(this.fechaDesde);
      filtrados = filtrados.filter(log => 
        new Date(log.fechaCreacion) >= new Date(this.fechaDesde)
      );
    }
    
    if (this.fechaHasta) {
      this.filters.fechaHasta = new Date(this.fechaHasta);
      filtrados = filtrados.filter(log => 
        new Date(log.fechaCreacion) <= new Date(this.fechaHasta)
      );
    }
    
    this.logsFiltrados = filtrados;
  }

  limpiarFiltros(): void {
    this.filters = {};
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.aplicarFiltros();
  }

  calcularEstadisticas(): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    
    this.estadisticas = {
      total: this.logs.length,
      hoy: this.logs.filter(log => new Date(log.fechaCreacion) >= hoy).length,
      semana: this.logs.filter(log => new Date(log.fechaCreacion) >= inicioSemana).length,
      usuarios: new Set(this.logs.map(log => log.creadoPor)).size
    };
  }

  verDetalles(log: LogAuditoria): void {
    this.logSeleccionado = log;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.logSeleccionado = null;
  }

  volver(): void {
    this.router.navigate(['/dashboard/configuraciones']);
  }

  // Utility methods
  trackByLog(index: number, log: LogAuditoria): number {
    return log.id;
  }

  getInitials(userId: number): string {
    return `U${userId}`;
  }

  getEntidadLabel(entidad: string): string {
    const labels = {
      'usuario': 'Usuario',
      'cliente': 'Cliente',
      'visita': 'Visita',
      'configuracion': 'Configuración'
    };
    return labels[entidad as keyof typeof labels] || entidad;
  }

  getEntidadColor(entidad: string): string {
    const colors = {
      'usuario': 'primary',
      'cliente': 'info',
      'visita': 'success',
      'configuracion': 'warning'
    };
    return colors[entidad as keyof typeof colors] || 'secondary';
  }

  getAccionLabel(accion: AccionAuditoria): string {
    const labels = {
      'CREAR': 'Crear',
      'ACTUALIZAR': 'Actualizar',
      'ELIMINAR': 'Eliminar',
      'LOGIN': 'Iniciar Sesión',
      'LOGOUT': 'Cerrar Sesión',
      'CAMBIO_PASSWORD': 'Cambio de Contraseña',
      'ACCESO_DENEGADO': 'Acceso Denegado'
    };
    return labels[accion] || accion;
  }

  getAccionIcon(accion: AccionAuditoria): string {
    const iconos = {
      'CREAR': 'fas fa-plus-circle',
      'ACTUALIZAR': 'fas fa-edit',
      'ELIMINAR': 'fas fa-trash-alt',
      'LOGIN': 'fas fa-sign-in-alt',
      'LOGOUT': 'fas fa-sign-out-alt',
      'CAMBIO_PASSWORD': 'fas fa-key',
      'ACCESO_DENEGADO': 'fas fa-ban'
    };
    return iconos[accion] || 'fas fa-info-circle';
  }

  getAccionColor(accion: AccionAuditoria): string {
    const colores = {
      'CREAR': 'text-success',
      'ACTUALIZAR': 'text-primary',
      'ELIMINAR': 'text-danger',
      'LOGIN': 'text-info',
      'LOGOUT': 'text-secondary',
      'CAMBIO_PASSWORD': 'text-warning',
      'ACCESO_DENEGADO': 'text-danger'
    };
    return colores[accion] || 'text-muted';
  }

  getUserAgentSummary(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('Android')) return 'Android';
    return 'Desconocido';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}