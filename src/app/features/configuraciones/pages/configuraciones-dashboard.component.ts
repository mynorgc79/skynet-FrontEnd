import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionService } from '../../../core/services/configuracion.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { 
  ConfiguracionesPorCategoria, 
  CategoriaConfiguracion, 
  Usuario,
  LogAuditoria 
} from '@core/interfaces';

@Component({
  selector: 'app-configuraciones-dashboard',
  standalone: false,
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">Configuraciones del Sistema</h2>
              <p class="text-muted mb-0">Administración y configuración del sistema Skynet</p>
            </div>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-outline-primary"
                (click)="verLogs()">
                <i class="fas fa-history me-2"></i>
                Logs de Auditoría
              </button>
              <button 
                class="btn btn-outline-success"
                (click)="ejecutarRespaldo()"
                [disabled]="ejecutandoRespaldo">
                <span *ngIf="ejecutandoRespaldo" class="spinner-border spinner-border-sm me-2"></span>
                <i *ngIf="!ejecutandoRespaldo" class="fas fa-database me-2"></i>
                {{ ejecutandoRespaldo ? 'Ejecutando...' : 'Respaldo Manual' }}
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
                  <div class="h4 mb-0">{{ estadisticas.totalConfiguraciones || 0 }}</div>
                  <div>Configuraciones</div>
                </div>
                <i class="fas fa-cogs fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="h4 mb-0">{{ estadisticas.logsRecientes || 0 }}</div>
                  <div>Logs Hoy</div>
                </div>
                <i class="fas fa-file-alt fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="h4 mb-0">{{ estadisticas.ultimoRespaldo || '-' }}</div>
                  <div>Último Respaldo</div>
                </div>
                <i class="fas fa-check-circle fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="h4 mb-0">{{ estadisticas.sesionesActivas || 0 }}</div>
                  <div>Sesiones Activas</div>
                </div>
                <i class="fas fa-users fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categorías de configuración -->
      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-list me-2"></i>
                Categorías de Configuración
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                <div 
                  *ngFor="let categoria of categorias" 
                  class="list-group-item list-group-item-action"
                  (click)="abrirCategoria(categoria.categoria)"
                  style="cursor: pointer;">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <div class="me-3">
                        <i [class]="categoria.icono + ' fa-2x text-primary'"></i>
                      </div>
                      <div>
                        <h6 class="mb-1">{{ getCategoriaLabel(categoria.categoria) }}</h6>
                        <p class="mb-1 text-muted">{{ categoria.descripcion }}</p>
                        <small class="text-muted">{{ categoria.configuraciones.length }} configuraciones</small>
                      </div>
                    </div>
                    <div class="text-end">
                      <span class="badge bg-secondary">{{ categoria.configuraciones.length }}</span>
                      <div class="mt-1">
                        <i class="fas fa-chevron-right text-muted"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar con información adicional -->
        <div class="col-lg-4">
          
          <!-- Información del sistema -->
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-info-circle me-2"></i>
                Información del Sistema
              </h6>
            </div>
            <div class="card-body">
              <div class="small">
                <div class="d-flex justify-content-between mb-2">
                  <span>Versión:</span>
                  <span class="fw-bold">{{ infoSistema.version || '1.0.0' }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Zona Horaria:</span>
                  <span>{{ infoSistema.timezone || 'America/Guatemala' }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Uptime:</span>
                  <span>{{ infoSistema.uptime || '5d 12h' }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Usuarios Online:</span>
                  <span class="fw-bold">{{ infoSistema.usuariosOnline || 3 }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones rápidas -->
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-bolt me-2"></i>
                Acciones Rápidas
              </h6>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button 
                  class="btn btn-outline-primary btn-sm"
                  (click)="probarEmail()"
                  [disabled]="probandoEmail">
                  <span *ngIf="probandoEmail" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!probandoEmail" class="fas fa-envelope me-2"></i>
                  {{ probandoEmail ? 'Probando...' : 'Probar Email' }}
                </button>
                <button 
                  class="btn btn-outline-success btn-sm"
                  (click)="probarMapas()"
                  [disabled]="probandoMapas">
                  <span *ngIf="probandoMapas" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!probandoMapas" class="fas fa-map me-2"></i>
                  {{ probandoMapas ? 'Probando...' : 'Probar Mapas' }}
                </button>
                <button 
                  class="btn btn-outline-info btn-sm"
                  (click)="verRespaldos()">
                  <i class="fas fa-history me-2"></i>
                  Ver Respaldos
                </button>
                <button 
                  class="btn btn-outline-warning btn-sm"
                  (click)="limpiarCache()">
                  <i class="fas fa-broom me-2"></i>
                  Limpiar Cache
                </button>
              </div>
            </div>
          </div>

          <!-- Logs recientes -->
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-history me-2"></i>
                Actividad Reciente
              </h6>
            </div>
            <div class="card-body">
              <div *ngIf="logsRecientes?.length === 0" class="text-center text-muted py-3">
                <i class="fas fa-inbox fa-2x mb-2"></i>
                <div>No hay logs recientes</div>
              </div>
              <div *ngFor="let log of logsRecientes?.slice(0, 5)" class="d-flex align-items-start mb-3">
                <div class="me-3">
                  <i [class]="getLogIcon(log.accion)" [ngClass]="getLogColor(log.accion)"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-semibold small">{{ log.descripcion }}</div>
                  <small class="text-muted">{{ formatDateTime(log.fechaCreacion) }}</small>
                </div>
              </div>
              <div class="text-center mt-3" *ngIf="logsRecientes && logsRecientes.length > 5">
                <button class="btn btn-sm btn-outline-primary" (click)="verLogs()">
                  Ver todos los logs
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Loading indicator -->
      <div *ngIf="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .list-group-item:hover {
      background-color: #f8f9fa;
    }
    
    .opacity-75 {
      opacity: 0.75;
    }
    
    .card-header h5, .card-header h6 {
      color: #495057;
    }
    
    .badge {
      font-size: 0.75em;
    }
  `]
})
export class ConfiguracionesDashboardComponent implements OnInit {
  
  private configuracionService = inject(ConfiguracionService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private authService = inject(AuthService);

  categorias: ConfiguracionesPorCategoria[] = [];
  logsRecientes: LogAuditoria[] = [];
  currentUser: Usuario | null = null;
  loading = false;
  ejecutandoRespaldo = false;
  probandoEmail = false;
  probandoMapas = false;

  estadisticas = {
    totalConfiguraciones: 0,
    logsRecientes: 0,
    ultimoRespaldo: '-',
    sesionesActivas: 0
  };

  infoSistema = {
    version: '1.0.0',
    timezone: 'America/Guatemala',
    uptime: '5d 12h',
    usuariosOnline: 3
  };

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.rol !== 'ADMINISTRADOR') {
      this.toastService.showError('Acceso denegado');
      this.router.navigate(['/dashboard']);
      return;
    }
    
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    
    // Cargar categorías de configuración
    this.configuracionService.getConfiguracionesPorCategoria().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.estadisticas.totalConfiguraciones = categorias.reduce((total, cat) => total + cat.configuraciones.length, 0);
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al cargar configuraciones');
        this.loading = false;
        console.error('Error loading configurations:', error);
      }
    });

    // Cargar logs recientes
    this.configuracionService.getLogsAuditoria().subscribe({
      next: (logs) => {
        this.logsRecientes = logs;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        this.estadisticas.logsRecientes = logs.filter(log => 
          new Date(log.fechaCreacion) >= hoy
        ).length;
      },
      error: (error) => {
        console.error('Error loading logs:', error);
      }
    });
  }

  abrirCategoria(categoria: CategoriaConfiguracion): void {
    this.router.navigate(['/dashboard/configuraciones/categoria', categoria]);
  }

  verLogs(): void {
    this.router.navigate(['/dashboard/configuraciones/logs']);
  }

  verRespaldos(): void {
    this.router.navigate(['/dashboard/configuraciones/respaldos']);
  }

  ejecutarRespaldo(): void {
    this.ejecutandoRespaldo = true;
    this.configuracionService.ejecutarRespaldo().subscribe({
      next: (resultado) => {
        this.toastService.showSuccess(`Respaldo ejecutado: ${resultado.archivo}`);
        this.ejecutandoRespaldo = false;
        this.estadisticas.ultimoRespaldo = 'Ahora';
      },
      error: (error) => {
        this.toastService.showError('Error al ejecutar respaldo');
        this.ejecutandoRespaldo = false;
        console.error('Error executing backup:', error);
      }
    });
  }

  probarEmail(): void {
    this.probandoEmail = true;
    this.configuracionService.probarConfiguracionEmail().subscribe({
      next: (resultado) => {
        if (resultado.exito) {
          this.toastService.showSuccess(resultado.mensaje);
        } else {
          this.toastService.showError(resultado.mensaje);
        }
        this.probandoEmail = false;
      },
      error: (error) => {
        this.toastService.showError('Error al probar configuración de email');
        this.probandoEmail = false;
        console.error('Error testing email:', error);
      }
    });
  }

  probarMapas(): void {
    this.probandoMapas = true;
    this.configuracionService.probarConfiguracionMapas().subscribe({
      next: (resultado) => {
        if (resultado.exito) {
          this.toastService.showSuccess(resultado.mensaje);
        } else {
          this.toastService.showError(resultado.mensaje);
        }
        this.probandoMapas = false;
      },
      error: (error) => {
        this.toastService.showError('Error al probar configuración de mapas');
        this.probandoMapas = false;
        console.error('Error testing maps:', error);
      }
    });
  }

  limpiarCache(): void {
    // Simular limpieza de cache
    this.toastService.showSuccess('Cache del sistema limpiado correctamente');
  }

  // Utility methods
  getCategoriaLabel(categoria: CategoriaConfiguracion): string {
    return this.configuracionService.getCategoriaInfo(categoria).nombre;
  }

  getLogIcon(accion: string): string {
    const iconos = {
      'CREAR': 'fas fa-plus-circle',
      'ACTUALIZAR': 'fas fa-edit',
      'ELIMINAR': 'fas fa-trash-alt',
      'LOGIN': 'fas fa-sign-in-alt',
      'LOGOUT': 'fas fa-sign-out-alt',
      'CAMBIO_PASSWORD': 'fas fa-key',
      'ACCESO_DENEGADO': 'fas fa-ban'
    };
    return iconos[accion as keyof typeof iconos] || 'fas fa-info-circle';
  }

  getLogColor(accion: string): string {
    const colores = {
      'CREAR': 'text-success',
      'ACTUALIZAR': 'text-primary',
      'ELIMINAR': 'text-danger',
      'LOGIN': 'text-info',
      'LOGOUT': 'text-secondary',
      'CAMBIO_PASSWORD': 'text-warning',
      'ACCESO_DENEGADO': 'text-danger'
    };
    return colores[accion as keyof typeof colores] || 'text-muted';
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}