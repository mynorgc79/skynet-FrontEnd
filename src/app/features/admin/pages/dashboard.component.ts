import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MockDataService } from '@core/services/mock-data.service';
import { Usuario, Visita } from '@core/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="row">
      <!-- Header con información del usuario -->
      <div class="col-12 mb-4">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <h4 class="card-title mb-0">
                  <i class="fas fa-tachometer-alt me-2"></i>
                  Dashboard - {{ getRoleTitle() }}
                </h4>
                <p class="card-text mb-0">
                  Bienvenido {{ currentUser?.nombre }} {{ currentUser?.apellido }}
                </p>
                <small class="text-light">
                  <i class="fas fa-calendar me-1"></i>
                  {{ getCurrentDate() }}
                </small>
              </div>
              <div class="col-auto">
                <div class="text-center">
                  <i class="fas fa-user-circle fa-3x"></i>
                  <div class="mt-2">
                    <span class="badge bg-light text-dark">{{ getRoleTitle() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards de estadísticas -->
    <div class="row mb-4">
      <div class="col-xl-3 col-md-6 mb-4" *ngFor="let stat of statistics">
        <div class="card border-left-{{ stat.color }} shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-{{ stat.color }} text-uppercase mb-1">
                  {{ stat.title }}
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ stat.value }}
                </div>
              </div>
              <div class="col-auto">
                <i class="{{ stat.icon }} fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido específico por rol -->
    <div class="row">
      <!-- Panel izquierdo -->
      <div class="col-lg-8">
        <!-- Visitas del día / Asignadas -->
        <div class="card shadow mb-4">
          <div class="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 font-weight-bold text-primary">
              <i class="fas fa-calendar-day me-2"></i>
              {{ getVisitasPanelTitle() }}
            </h6>
            <span class="badge bg-primary">{{ visitas.length }} visitas</span>
          </div>
          <div class="card-body">
            <div class="table-responsive" *ngIf="visitas.length > 0; else noVisitas">
              <table class="table table-bordered" width="100%" cellspacing="0">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Técnico</th>
                    <th>Hora</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let visita of visitas">
                    <td>
                      <strong>{{ visita.cliente?.nombre }} {{ visita.cliente?.apellido }}</strong>
                      <br>
                      <small class="text-muted">{{ visita.cliente?.email }}</small>
                    </td>
                    <td>{{ visita.tecnico?.nombre }} {{ visita.tecnico?.apellido }}</td>
                    <td>{{ formatTime(visita.fechaVisita) }}</td>
                    <td>
                      <small>{{ visita.motivo }}</small>
                    </td>
                    <td>
                      <span class="badge bg-{{ getEstadoBadgeColor(visita.estado) }}">
                        {{ getEstadoLabel(visita.estado) }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary me-1" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-success" 
                        *ngIf="canStartVisita(visita)"
                        title="Iniciar visita">
                        <i class="fas fa-play"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-warning" 
                        *ngIf="canManageVisita(visita)"
                        title="Gestionar">
                        <i class="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ng-template #noVisitas>
              <div class="text-center py-4">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No hay visitas programadas para hoy</h5>
                <p class="text-muted">Las nuevas visitas aparecerán aquí automáticamente</p>
              </div>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- Panel derecho -->
      <div class="col-lg-4">
        <!-- Actividad reciente -->
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">
              <i class="fas fa-clock me-2"></i>
              Actividad Reciente
            </h6>
          </div>
          <div class="card-body">
            <div class="timeline">
              <div class="timeline-item" *ngFor="let activity of recentActivity">
                <div class="timeline-marker bg-{{ activity.type }}"></div>
                <div class="timeline-content">
                  <h6 class="timeline-title">{{ activity.title }}</h6>
                  <p class="timeline-text">{{ activity.description }}</p>
                  <small class="text-muted">{{ activity.time }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mapa de ubicaciones (si es técnico) -->
        <div class="card shadow mb-4" *ngIf="userRole === 'TECNICO'">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">
              <i class="fas fa-map-marker-alt me-2"></i>
              Mis Visitas Hoy
            </h6>
          </div>
          <div class="card-body">
            <div id="map" style="height: 300px; background: #f8f9fa; border-radius: 5px; display: flex; align-items: center; justify-content: center;">
              <div class="text-center">
                <i class="fas fa-map fa-2x text-muted mb-2"></i>
                <p class="text-muted mb-0">
                  Mapa de Google Maps se integrará aquí
                </p>
                <small class="text-muted">{{ visitas.length }} ubicaciones</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen rápido para supervisores -->
        <div class="card shadow mb-4" *ngIf="userRole === 'SUPERVISOR'">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">
              <i class="fas fa-users me-2"></i>
              Mi Equipo
            </h6>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span>Técnicos activos:</span>
              <span class="badge bg-primary">3</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span>En campo:</span>
              <span class="badge bg-success">2</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span>Disponibles:</span>
              <span class="badge bg-secondary">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .border-left-primary { border-left: 0.25rem solid #4e73df !important; }
    .border-left-success { border-left: 0.25rem solid #1cc88a !important; }
    .border-left-info { border-left: 0.25rem solid #36b9cc !important; }
    .border-left-warning { border-left: 0.25rem solid #f6c23e !important; }
    .border-left-danger { border-left: 0.25rem solid #e74a3b !important; }
    
    .timeline {
      position: relative;
      padding-left: 1.5rem;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 0.5rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #dee2e6;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 1.5rem;
    }
    
    .timeline-marker {
      position: absolute;
      left: -1.7rem;
      top: 0.2rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #fff;
    }
    
    .bg-primary { background-color: #007bff !important; }
    .bg-success { background-color: #28a745 !important; }
    .bg-warning { background-color: #ffc107 !important; }
    .bg-danger { background-color: #dc3545 !important; }
  `]
})
export class DashboardComponent implements OnInit {
  
  private authService = inject(AuthService);
  private mockDataService = inject(MockDataService);

  userRole: string = '';
  currentUser: Usuario | null = null;
  statistics: any[] = [];
  visitas: Visita[] = [];
  recentActivity: any[] = [];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userRole = this.authService.getCurrentUserRole() || '';
    
    this.loadStatistics();
    this.loadVisitas();
    this.loadRecentActivity();
  }

  getRoleTitle(): string {
    const titles = {
      'ADMINISTRADOR': 'Administrador',
      'SUPERVISOR': 'Supervisor',
      'TECNICO': 'Técnico'
    };
    return titles[this.userRole as keyof typeof titles] || 'Usuario';
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getVisitasPanelTitle(): string {
    switch (this.userRole) {
      case 'ADMINISTRADOR':
        return 'Todas las Visitas de Hoy';
      case 'SUPERVISOR':
        return 'Visitas de Mi Equipo';
      case 'TECNICO':
        return 'Mis Visitas de Hoy';
      default:
        return 'Visitas';
    }
  }

  loadStatistics(): void {
    const userId = this.currentUser?.idUsuario || 0;
    
    switch (this.userRole) {
      case 'ADMINISTRADOR':
        this.mockDataService.getEstadisticasAdmin().subscribe(stats => {
          this.statistics = [
            { title: 'Total Usuarios', value: stats.totalUsuarios, color: 'primary', icon: 'fas fa-users' },
            { title: 'Clientes Activos', value: stats.clientesActivos, color: 'success', icon: 'fas fa-building' },
            { title: 'Visitas Hoy', value: stats.visitasHoy, color: 'info', icon: 'fas fa-calendar-day' },
            { title: 'Reportes Pendientes', value: stats.reportesPendientes, color: 'warning', icon: 'fas fa-file-alt' }
          ];
        });
        break;
        
      case 'SUPERVISOR':
        this.mockDataService.getEstadisticasSupervisor(userId).subscribe(stats => {
          this.statistics = [
            { title: 'Técnicos a Cargo', value: stats.tecnicosACargo, color: 'primary', icon: 'fas fa-users' },
            { title: 'Visitas Programadas', value: stats.visitasProgramadas, color: 'info', icon: 'fas fa-calendar-check' },
            { title: 'Completadas Hoy', value: stats.completadasHoy, color: 'success', icon: 'fas fa-check-circle' },
            { title: 'Pendientes', value: stats.pendientes, color: 'warning', icon: 'fas fa-clock' }
          ];
        });
        break;
        
      case 'TECNICO':
        this.mockDataService.getEstadisticasTecnico(userId).subscribe(stats => {
          this.statistics = [
            { title: 'Visitas Hoy', value: stats.visitasHoy, color: 'info', icon: 'fas fa-calendar-day' },
            { title: 'Completadas', value: stats.completadas, color: 'success', icon: 'fas fa-check-circle' },
            { title: 'Pendientes', value: stats.pendientes, color: 'warning', icon: 'fas fa-clock' },
            { title: 'Distancia Total', value: stats.distanciaTotal, color: 'primary', icon: 'fas fa-route' }
          ];
        });
        break;
    }
  }

  loadVisitas(): void {
    const userId = this.currentUser?.idUsuario || 0;
    
    switch (this.userRole) {
      case 'ADMINISTRADOR':
        this.mockDataService.getTodasLasVisitasHoy().subscribe(visitas => {
          this.visitas = visitas;
        });
        break;
        
      case 'SUPERVISOR':
        this.mockDataService.getVisitas().subscribe(visitas => {
          // Filtrar visitas por supervisor
          this.visitas = visitas.filter(v => v.idSupervisor === userId);
        });
        break;
        
      case 'TECNICO':
        this.mockDataService.getVisitasByTecnico(userId).subscribe(visitas => {
          this.visitas = visitas;
        });
        break;
    }
  }

  loadRecentActivity(): void {
    const userId = this.currentUser?.idUsuario || 0;
    this.mockDataService.getActividadReciente(userId).subscribe(activity => {
      this.recentActivity = activity;
    });
  }

  formatTime(fecha: Date): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoBadgeColor(estado: string): string {
    const colors = {
      'PROGRAMADA': 'secondary',
      'EN_PROGRESO': 'warning',
      'COMPLETADA': 'success',
      'CANCELADA': 'danger'
    };
    return colors[estado as keyof typeof colors] || 'secondary';
  }

  getEstadoLabel(estado: string): string {
    const labels = {
      'PROGRAMADA': 'Programada',
      'EN_PROGRESO': 'En Progreso',
      'COMPLETADA': 'Completada',
      'CANCELADA': 'Cancelada'
    };
    return labels[estado as keyof typeof labels] || estado;
  }

  canStartVisita(visita: Visita): boolean {
    return this.userRole === 'TECNICO' && 
           visita.estado === 'PROGRAMADA' && 
           visita.idTecnico === this.currentUser?.idUsuario;
  }

  canManageVisita(visita: Visita): boolean {
    return this.userRole === 'SUPERVISOR' && 
           visita.idSupervisor === this.currentUser?.idUsuario;
  }
}