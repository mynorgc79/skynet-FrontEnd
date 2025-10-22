import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { VisitasService } from '../services/visitas.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Visita, VisitaFilter, EstadoVisita, Usuario } from '@core/interfaces';

@Component({
  selector: 'app-visitas-list',
  standalone: false,
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">Gestión de Visitas</h2>
              <p class="text-muted mb-0">Planificación y seguimiento de visitas técnicas</p>
            </div>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-outline-primary"
                (click)="toggleCalendarView()">
                <i [class]="showCalendarView ? 'fas fa-list' : 'fas fa-calendar-alt'"></i>
                {{ showCalendarView ? 'Vista Lista' : 'Vista Calendario' }}
              </button>
              <button 
                class="btn btn-success"
                (click)="nuevaVisita()">
                <i class="fas fa-plus me-2"></i>
                Nueva Visita
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="h4 mb-0">{{ estadisticas?.programadas || 0 }}</div>
                  <div>Programadas</div>
                </div>
                <i class="fas fa-calendar-day fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="h4 mb-0">{{ estadisticas?.enProgreso || 0 }}</div>
                  <div>En Progreso</div>
                </div>
                <i class="fas fa-clock fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="h4 mb-0">{{ estadisticas?.completadas || 0 }}</div>
                  <div>Completadas</div>
                </div>
                <i class="fas fa-check-circle fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="h4 mb-0">{{ estadisticas?.total || 0 }}</div>
                  <div>Total</div>
                </div>
                <i class="fas fa-chart-bar fa-2x opacity-75"></i>
              </div>
            </div>
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
                (change)="applyFilters()">
            </div>
            <div class="col-md-2">
              <label class="form-label">Fecha hasta</label>
              <input 
                type="date" 
                class="form-control"
                [(ngModel)]="fechaHasta"
                (change)="applyFilters()">
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select 
                class="form-select"
                [(ngModel)]="filters.estado"
                (change)="applyFilters()">
                <option value="">Todos los estados</option>
                <option value="PROGRAMADA">Programada</option>
                <option value="EN_PROGRESO">En Progreso</option>
                <option value="COMPLETADA">Completada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Prioridad</label>
              <select 
                class="form-select"
                [(ngModel)]="filters.prioridad"
                (change)="applyFilters()">
                <option value="">Todas</option>
                <option value="URGENTE">Urgente</option>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
            <div class="col-md-2" *ngIf="currentUser?.rol !== 'TECNICO'">
              <label class="form-label">Técnico</label>
              <select 
                class="form-select"
                [(ngModel)]="filters.idTecnico"
                (change)="applyFilters()">
                <option value="">Todos</option>
                <option *ngFor="let tecnico of tecnicos" [value]="tecnico.idUsuario">
                  {{ tecnico.nombre }} {{ tecnico.apellido }}
                </option>
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

      <!-- Vista Calendario (Simplificada) -->
      <div *ngIf="showCalendarView" class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-calendar-alt me-2"></i>
            Calendario de Visitas
          </h5>
        </div>
        <div class="card-body">
          <div class="calendar-view">
            <div class="text-center py-5">
              <i class="fas fa-calendar-week fa-3x text-muted mb-3"></i>
              <h5 class="text-muted">Vista de Calendario</h5>
              <p class="text-muted">Aquí se integrará un calendario interactivo para visualizar las visitas</p>
              <div class="row g-2 mt-3">
                <div class="col-md-4" *ngFor="let visita of visitasFiltradas.slice(0, 6)">
                  <div class="card border-start border-4" 
                       [class]="'border-' + visitasService.getEstadoColor(visita.estado)">
                    <div class="card-body p-2">
                      <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                          <small class="fw-bold">{{ visita.cliente?.nombre || 'Cliente' }}</small><br>
                          <small class="text-muted">{{ visita.motivo }}</small><br>
                          <small class="text-primary">
                            📅 {{ formatDate(visita.fechaVisita) }} - {{ visitasService.getTimeRange(visita) }}
                          </small>
                        </div>
                        <span class="badge ms-2" 
                              [class]="'bg-' + visitasService.getEstadoColor(visita.estado)">
                          {{ visitasService.getEstadoLabel(visita.estado) }}
                        </span>
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
      <div *ngIf="!showCalendarView" class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-clipboard-list me-2"></i>
            Visitas ({{ visitasFiltradas.length }})
          </h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Cliente</th>
                  <th>Motivo</th>
                  <th>Técnico</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Duración</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let visita of visitasFiltradas; trackBy: trackByVisita">
                  <td>
                    <div>
                      <div class="fw-semibold">{{ formatDate(visita.fechaVisita) }}</div>
                      <small class="text-muted">{{ visitasService.getTimeRange(visita) }}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div class="fw-medium">{{ visita.cliente?.nombre || 'Cliente' }} {{ visita.cliente?.apellido || '' }}</div>
                      <small class="text-muted">{{ visita.cliente?.empresa || 'Sin empresa' }}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div class="fw-medium">{{ visita.motivo }}</div>
                      <small class="text-muted" *ngIf="visita.descripcion">{{ visita.descripcion | slice:0:50 }}{{ visita.descripcion!.length > 50 ? '...' : '' }}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>{{ visita.tecnico?.nombre || 'Técnico' }} {{ visita.tecnico?.apellido || '' }}</div>
                      <small class="text-muted">{{ visita.tecnico?.email || '' }}</small>
                    </div>
                  </td>
                  <td>
                    <span class="badge" 
                          [class]="'bg-' + visitasService.getPrioridadColor(visita.prioridad)">
                      {{ visitasService.getPrioridadLabel(visita.prioridad) }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" 
                          [class]="'bg-' + visitasService.getEstadoColor(visita.estado)">
                      {{ visitasService.getEstadoLabel(visita.estado) }}
                    </span>
                  </td>
                  <td>
                    <small>{{ visitasService.formatDuration(visita.duracionEstimada || 60) }}</small>
                  </td>
                  <td class="text-center">
                    <div class="btn-group btn-group-sm">
                      <button 
                        class="btn btn-outline-primary"
                        (click)="verVisita(visita.idVisita)"
                        title="Ver detalles">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        *ngIf="visitasService.canEdit(visita)"
                        class="btn btn-outline-warning"
                        (click)="editarVisita(visita.idVisita)"
                        title="Editar">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        *ngIf="visitasService.canIniciar(visita) && canManageVisita(visita)"
                        class="btn btn-outline-success"
                        (click)="iniciarVisita(visita)"
                        title="Iniciar visita">
                        <i class="fas fa-play"></i>
                      </button>
                      <button 
                        *ngIf="visitasService.canCompletar(visita) && canManageVisita(visita)"
                        class="btn btn-outline-info"
                        (click)="completarVisita(visita)"
                        title="Completar visita">
                        <i class="fas fa-check"></i>
                      </button>
                      <button 
                        *ngIf="visitasService.canCancelar(visita) && canManageVisita(visita)"
                        class="btn btn-outline-danger"
                        (click)="cancelarVisita(visita)"
                        title="Cancelar visita">
                        <i class="fas fa-times"></i>
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
      <div *ngIf="!loading && visitasFiltradas.length === 0" class="text-center py-5">
        <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No se encontraron visitas</h5>
        <p class="text-muted">Intenta ajustar los filtros o crear una nueva visita</p>
      </div>
    </div>
  `,
  styles: [`
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
    
    .calendar-view {
      min-height: 300px;
    }
    
    .card.border-start {
      border-left-width: 4px !important;
    }
    
    .opacity-75 {
      opacity: 0.75;
    }
  `]
})
export class VisitasListComponent implements OnInit {
  
  visitasService = inject(VisitasService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private authService = inject(AuthService);

  visitas: Visita[] = [];
  visitasFiltradas: Visita[] = [];
  tecnicos: Usuario[] = [];
  loading = false;
  showCalendarView = false;
  
  filters: VisitaFilter = {};
  fechaDesde: string = '';
  fechaHasta: string = '';
  
  estadisticas: any = {};
  currentUser: Usuario | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    
    // Aplicar filtros por rol
    if (this.currentUser?.rol === 'TECNICO') {
      this.filters.idTecnico = this.currentUser.idUsuario;
    } else if (this.currentUser?.rol === 'SUPERVISOR') {
      this.filters.idSupervisor = this.currentUser.idUsuario;
    }
    
    this.cargarVisitas();
    this.cargarEstadisticas();
  }

  cargarVisitas(): void {
    this.visitasService.getAll(this.filters).subscribe({
      next: (visitas) => {
        this.visitas = visitas;
        this.visitasFiltradas = [...visitas];
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al cargar visitas');
        this.loading = false;
        console.error('Error loading visits:', error);
      }
    });
  }

  cargarEstadisticas(): void {
    this.visitasService.getEstadisticas().subscribe({
      next: (stats) => {
        this.estadisticas = stats;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  applyFilters(): void {
    if (this.fechaDesde) {
      this.filters.fechaDesde = new Date(this.fechaDesde);
    } else {
      delete this.filters.fechaDesde;
    }
    
    if (this.fechaHasta) {
      this.filters.fechaHasta = new Date(this.fechaHasta);
    } else {
      delete this.filters.fechaHasta;
    }
    
    this.cargarVisitas();
  }

  limpiarFiltros(): void {
    this.filters = {};
    this.fechaDesde = '';
    this.fechaHasta = '';
    
    // Reaplicar filtros por rol
    if (this.currentUser?.rol === 'TECNICO') {
      this.filters.idTecnico = this.currentUser.idUsuario;
    } else if (this.currentUser?.rol === 'SUPERVISOR') {
      this.filters.idSupervisor = this.currentUser.idUsuario;
    }
    
    this.cargarVisitas();
  }

  toggleCalendarView(): void {
    this.showCalendarView = !this.showCalendarView;
  }

  nuevaVisita(): void {
    this.router.navigate(['/dashboard/visitas/nueva']);
  }

  verVisita(id: number): void {
    this.router.navigate(['/dashboard/visitas', id]);
  }

  editarVisita(id: number): void {
    this.router.navigate(['/dashboard/visitas', id, 'editar']);
  }

  iniciarVisita(visita: Visita): void {
    this.visitasService.iniciar(visita.idVisita).subscribe({
      next: (updatedVisita) => {
        const index = this.visitas.findIndex(v => v.idVisita === visita.idVisita);
        if (index !== -1) {
          this.visitas[index] = updatedVisita;
          this.visitasFiltradas = [...this.visitas];
        }
        this.toastService.showSuccess('Visita iniciada correctamente');
        this.cargarEstadisticas();
      },
      error: (error) => {
        this.toastService.showError('Error al iniciar visita');
        console.error('Error starting visit:', error);
      }
    });
  }

  completarVisita(visita: Visita): void {
    // Aquí podrías abrir un modal para observaciones
    const observaciones = prompt('Observaciones finales (opcional):');
    
    this.visitasService.completar(visita.idVisita, observaciones || undefined).subscribe({
      next: (updatedVisita) => {
        const index = this.visitas.findIndex(v => v.idVisita === visita.idVisita);
        if (index !== -1) {
          this.visitas[index] = updatedVisita;
          this.visitasFiltradas = [...this.visitas];
        }
        this.toastService.showSuccess('Visita completada correctamente');
        this.cargarEstadisticas();
      },
      error: (error) => {
        this.toastService.showError('Error al completar visita');
        console.error('Error completing visit:', error);
      }
    });
  }

  cancelarVisita(visita: Visita): void {
    const motivo = prompt('Motivo de cancelación:');
    if (motivo) {
      this.visitasService.cancelar(visita.idVisita, motivo).subscribe({
        next: (updatedVisita) => {
          const index = this.visitas.findIndex(v => v.idVisita === visita.idVisita);
          if (index !== -1) {
            this.visitas[index] = updatedVisita;
            this.visitasFiltradas = [...this.visitas];
          }
          this.toastService.showSuccess('Visita cancelada correctamente');
          this.cargarEstadisticas();
        },
        error: (error) => {
          this.toastService.showError('Error al cancelar visita');
          console.error('Error canceling visit:', error);
        }
      });
    }
  }

  // Utility methods
  trackByVisita(index: number, visita: Visita): number {
    return visita.idVisita;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  canManageVisita(visita: Visita): boolean {
    if (this.currentUser?.rol === 'ADMINISTRADOR') return true;
    if (this.currentUser?.rol === 'SUPERVISOR') return visita.idSupervisor === this.currentUser.idUsuario;
    if (this.currentUser?.rol === 'TECNICO') return visita.idTecnico === this.currentUser.idUsuario;
    return false;
  }
}