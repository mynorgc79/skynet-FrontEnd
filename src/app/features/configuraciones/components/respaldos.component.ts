import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfiguracionService } from '../../../core/services/configuracion.service';
import { ToastService } from '../../../shared/services/toast.service';
import { 
  RespaldoSistema, 
  EstadoRespaldo,
  TipoRespaldo 
} from '@core/interfaces';

@Component({
  selector: 'app-respaldos',
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
                <i class="fas fa-database me-2"></i>
                Respaldos del Sistema
              </h2>
              <p class="text-muted mb-0">Gestión de copias de seguridad y restauración de datos</p>
            </div>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-primary"
                (click)="crearRespaldo()"
                [disabled]="operacionEnProgreso">
                <i class="fas fa-plus me-2"></i>
                Crear Respaldo
              </button>
              <button 
                class="btn btn-outline-secondary"
                (click)="volver()">
                <i class="fas fa-arrow-left me-2"></i>
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card border-success">
            <div class="card-body text-center">
              <i class="fas fa-download fa-2x text-success mb-2"></i>
              <h6>Respaldo Completo</h6>
              <button 
                class="btn btn-outline-success btn-sm"
                (click)="crearRespaldoTipo(TipoRespaldo.COMPLETO)"
                [disabled]="operacionEnProgreso">
                Crear Ahora
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-info">
            <div class="card-body text-center">
              <i class="fas fa-file-alt fa-2x text-info mb-2"></i>
              <h6>Solo Configuraciones</h6>
              <button 
                class="btn btn-outline-info btn-sm"
                (click)="crearRespaldoTipo(TipoRespaldo.CONFIGURACIONES)"
                [disabled]="operacionEnProgreso">
                Crear Ahora
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-warning">
            <div class="card-body text-center">
              <i class="fas fa-users fa-2x text-warning mb-2"></i>
              <h6>Solo Usuarios</h6>
              <button 
                class="btn btn-outline-warning btn-sm"
                (click)="crearRespaldoTipo(TipoRespaldo.USUARIOS)"
                [disabled]="operacionEnProgreso">
                Crear Ahora
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-primary">
            <div class="card-body text-center">
              <i class="fas fa-clock fa-2x text-primary mb-2"></i>
              <h6>Programar</h6>
              <button 
                class="btn btn-outline-primary btn-sm"
                (click)="programarRespaldo()">
                Configurar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado actual -->
      <div class="card mb-4" *ngIf="operacionEnProgreso">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="spinner-border spinner-border-sm text-primary me-3" role="status"></div>
            <div>
              <h6 class="mb-1">{{ operacionEnProgreso }}</h6>
              <div class="progress" style="width: 300px;">
                <div 
                  class="progress-bar progress-bar-striped progress-bar-animated" 
                  [style.width.%]="progresoOperacion">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de respaldos -->
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-list me-2"></i>
              Respaldos Existentes ({{ respaldos.length }})
            </h5>
            <button 
              class="btn btn-outline-secondary btn-sm"
              (click)="actualizarLista()">
              <i class="fas fa-sync-alt me-2"></i>
              Actualizar
            </button>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Fecha/Hora</th>
                  <th>Tipo</th>
                  <th>Tamaño</th>
                  <th>Estado</th>
                  <th>Descripción</th>
                  <th>Duración</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let respaldo of respaldos; trackBy: trackByRespaldo">
                  <td>
                    <div class="fw-semibold">{{ formatDate(respaldo.fechaCreacion) }}</div>
                    <small class="text-muted">{{ formatTime(respaldo.fechaCreacion) }}</small>
                  </td>
                  <td>
                    <span class="badge" [class]="'bg-' + getTipoColor(respaldo.tipo)">
                      <i [class]="getTipoIcon(respaldo.tipo)" class="me-1"></i>
                      {{ getTipoLabel(respaldo.tipo) }}
                    </span>
                  </td>
                  <td>
                    <div class="fw-medium">{{ formatTamano(respaldo.tamanoBytes) }}</div>
                    <small class="text-muted">{{ respaldo.archivos?.length || 0 }} archivos</small>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <span class="badge" [class]="'bg-' + getEstadoColor(respaldo.estado)">
                        <i [class]="getEstadoIcon(respaldo.estado)" class="me-1"></i>
                        {{ getEstadoLabel(respaldo.estado) }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="small">{{ respaldo.descripcion }}</div>
                    <div class="small text-muted" *ngIf="respaldo.version">
                      Versión: {{ respaldo.version }}
                    </div>
                  </td>
                  <td>
                    <div *ngIf="respaldo.duracionSegundos">
                      {{ formatDuracion(respaldo.duracionSegundos) }}
                    </div>
                    <div class="small text-muted">
                      Por: Usuario #{{ respaldo.creadoPor }}
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="btn-group" role="group">
                      <button 
                        class="btn btn-outline-primary btn-sm"
                        (click)="descargar(respaldo)"
                        [disabled]="respaldo.estado !== 'COMPLETADO'"
                        title="Descargar respaldo">
                        <i class="fas fa-download"></i>
                      </button>
                      <button 
                        class="btn btn-outline-info btn-sm"
                        (click)="verDetalles(respaldo)"
                        title="Ver detalles">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-outline-warning btn-sm"
                        (click)="restaurar(respaldo)"
                        [disabled]="respaldo.estado !== 'COMPLETADO'"
                        title="Restaurar desde este respaldo">
                        <i class="fas fa-upload"></i>
                      </button>
                      <button 
                        class="btn btn-outline-danger btn-sm"
                        (click)="eliminar(respaldo)"
                        [disabled]="respaldo.estado === 'EN_PROGRESO'"
                        title="Eliminar respaldo">
                        <i class="fas fa-trash"></i>
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
      <div *ngIf="!loading && respaldos.length === 0" class="text-center py-5">
        <i class="fas fa-database fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No hay respaldos</h5>
        <p class="text-muted">Crea tu primer respaldo para proteger tus datos</p>
        <button class="btn btn-primary" (click)="crearRespaldo()">
          <i class="fas fa-plus me-2"></i>
          Crear Primer Respaldo
        </button>
      </div>
    </div>

    <!-- Modal para crear respaldo -->
    <div class="modal fade" id="modalCrearRespaldo" tabindex="-1" *ngIf="mostrarModalCrear">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-plus me-2"></i>
              Crear Respaldo
            </h5>
            <button type="button" class="btn-close" (click)="cerrarModalCrear()"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label class="form-label">Tipo de Respaldo</label>
                <select class="form-select" [(ngModel)]="nuevoRespaldo.tipo" name="tipo">
                  <option value="COMPLETO">Completo (Todos los datos)</option>
                  <option value="INCREMENTAL">Incremental (Solo cambios)</option>
                  <option value="CONFIGURACIONES">Solo Configuraciones</option>
                  <option value="USUARIOS">Solo Usuarios</option>
                  <option value="CLIENTES">Solo Clientes</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  [(ngModel)]="nuevoRespaldo.descripcion"
                  name="descripcion"
                  placeholder="Descripción opcional del respaldo...">
                </textarea>
              </div>
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  [(ngModel)]="nuevoRespaldo.comprimido"
                  name="comprimido"
                  id="comprimido">
                <label class="form-check-label" for="comprimido">
                  Comprimir archivo de respaldo
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="cerrarModalCrear()">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              (click)="confirmarCrearRespaldo()"
              [disabled]="!nuevoRespaldo.tipo">
              <i class="fas fa-download me-2"></i>
              Crear Respaldo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para detalles del respaldo -->
    <div class="modal fade" id="modalDetalles" tabindex="-1" *ngIf="mostrarModalDetalles && respaldoSeleccionado">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-info-circle me-2"></i>
              Detalles del Respaldo
            </h5>
            <button type="button" class="btn-close" (click)="cerrarModalDetalles()"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold">Fecha de Creación</label>
                <div>{{ formatDateTime(respaldoSeleccionado.fechaCreacion) }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Tipo</label>
                <div>
                  <span class="badge" [class]="'bg-' + getTipoColor(respaldoSeleccionado.tipo)">
                    {{ getTipoLabel(respaldoSeleccionado.tipo) }}
                  </span>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Estado</label>
                <div>
                  <span class="badge" [class]="'bg-' + getEstadoColor(respaldoSeleccionado.estado)">
                    {{ getEstadoLabel(respaldoSeleccionado.estado) }}
                  </span>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Tamaño</label>
                <div>{{ formatTamano(respaldoSeleccionado.tamanoBytes) }}</div>
              </div>
              <div class="col-12" *ngIf="respaldoSeleccionado.descripcion">
                <label class="form-label fw-bold">Descripción</label>
                <div>{{ respaldoSeleccionado.descripcion }}</div>
              </div>
              <div class="col-md-6" *ngIf="respaldoSeleccionado.version">
                <label class="form-label fw-bold">Versión</label>
                <div>{{ respaldoSeleccionado.version }}</div>
              </div>
              <div class="col-md-6" *ngIf="respaldoSeleccionado.duracionSegundos">
                <label class="form-label fw-bold">Duración</label>
                <div>{{ formatDuracion(respaldoSeleccionado.duracionSegundos) }}</div>
              </div>
              <div class="col-12" *ngIf="respaldoSeleccionado.archivos && respaldoSeleccionado.archivos.length > 0">
                <label class="form-label fw-bold">Archivos Incluidos ({{ respaldoSeleccionado.archivos.length }})</label>
                <div class="bg-light p-2 rounded" style="max-height: 200px; overflow-y: auto;">
                  <div *ngFor="let archivo of respaldoSeleccionado.archivos" class="small">
                    <i class="fas fa-file me-2"></i>{{ archivo }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="cerrarModalDetalles()">
              Cerrar
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              (click)="descargar(respaldoSeleccionado)"
              [disabled]="respaldoSeleccionado.estado !== 'COMPLETADO'">
              <i class="fas fa-download me-2"></i>
              Descargar
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
    
    .progress {
      height: 8px;
    }
    
    .btn-group .btn {
      border-radius: 0.25rem;
      margin-right: 2px;
    }
    
    .modal {
      display: block;
      background-color: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class RespaldosComponent implements OnInit {
  
  private router = inject(Router);
  private configuracionService = inject(ConfiguracionService);
  private toastService = inject(ToastService);

  respaldos: RespaldoSistema[] = [];
  loading = false;
  operacionEnProgreso: string | null = null;
  progresoOperacion = 0;

  mostrarModalCrear = false;
  mostrarModalDetalles = false;
  respaldoSeleccionado: RespaldoSistema | null = null;

  // Hacer enum disponible en template
  TipoRespaldo = TipoRespaldo;

  nuevoRespaldo = {
    tipo: TipoRespaldo.COMPLETO,
    descripcion: '',
    comprimido: true
  };

  ngOnInit(): void {
    this.cargarRespaldos();
  }

  cargarRespaldos(): void {
    this.loading = true;
    this.configuracionService.getRespaldos().subscribe({
      next: (respaldos) => {
        this.respaldos = respaldos.sort((a, b) => 
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al cargar respaldos');
        this.loading = false;
        console.error('Error loading backups:', error);
      }
    });
  }

  crearRespaldo(): void {
    this.nuevoRespaldo = {
      tipo: TipoRespaldo.COMPLETO,
      descripcion: '',
      comprimido: true
    };
    this.mostrarModalCrear = true;
  }

  crearRespaldoTipo(tipo: TipoRespaldo): void {
    this.nuevoRespaldo = {
      tipo,
      descripcion: `Respaldo ${this.getTipoLabel(tipo)} - ${new Date().toLocaleString('es-ES')}`,
      comprimido: true
    };
    this.confirmarCrearRespaldo();
  }

  confirmarCrearRespaldo(): void {
    this.operacionEnProgreso = `Creando respaldo ${this.getTipoLabel(this.nuevoRespaldo.tipo)}...`;
    this.progresoOperacion = 0;
    this.cerrarModalCrear();

    // Simular progreso
    const interval = setInterval(() => {
      this.progresoOperacion += 10;
      if (this.progresoOperacion >= 100) {
        clearInterval(interval);
        this.finalizarCreacionRespaldo();
      }
    }, 500);

    this.configuracionService.crearRespaldo(this.nuevoRespaldo).subscribe({
      next: (respaldo) => {
        clearInterval(interval);
        this.finalizarCreacionRespaldo();
        this.toastService.showSuccess('Respaldo creado exitosamente');
        this.cargarRespaldos();
      },
      error: (error) => {
        clearInterval(interval);
        this.operacionEnProgreso = null;
        this.progresoOperacion = 0;
        this.toastService.showError('Error al crear respaldo');
        console.error('Error creating backup:', error);
      }
    });
  }

  finalizarCreacionRespaldo(): void {
    this.operacionEnProgreso = null;
    this.progresoOperacion = 0;
  }

  programarRespaldo(): void {
    this.toastService.showInfo('Funcionalidad de programación en desarrollo');
  }

  descargar(respaldo: RespaldoSistema): void {
    if (respaldo.estado !== 'COMPLETADO') {
      this.toastService.showWarning('Solo se pueden descargar respaldos completados');
      return;
    }

    // Simular descarga
    const link = document.createElement('a');
    link.download = `respaldo_${respaldo.tipo}_${new Date(respaldo.fechaCreacion).toISOString().split('T')[0]}.zip`;
    link.href = '#'; // En producción sería la URL real del archivo
    link.click();
    
    this.toastService.showSuccess('Descarga iniciada');
  }

  restaurar(respaldo: RespaldoSistema): void {
    if (respaldo.estado !== 'COMPLETADO') {
      this.toastService.showWarning('Solo se pueden restaurar respaldos completados');
      return;
    }

    const confirmacion = confirm(
      `¿Estás seguro de que deseas restaurar desde este respaldo?\n\n` +
      `Tipo: ${this.getTipoLabel(respaldo.tipo)}\n` +
      `Fecha: ${this.formatDateTime(respaldo.fechaCreacion)}\n\n` +
      `Esta acción no se puede deshacer.`
    );

    if (confirmacion) {
      this.operacionEnProgreso = 'Restaurando desde respaldo...';
      this.progresoOperacion = 0;

      // Simular progreso de restauración
      const interval = setInterval(() => {
        this.progresoOperacion += 15;
        if (this.progresoOperacion >= 100) {
          clearInterval(interval);
          this.operacionEnProgreso = null;
          this.progresoOperacion = 0;
          this.toastService.showSuccess('Restauración completada exitosamente');
        }
      }, 800);
    }
  }

  eliminar(respaldo: RespaldoSistema): void {
    if (respaldo.estado === 'EN_PROGRESO') {
      this.toastService.showWarning('No se puede eliminar un respaldo en progreso');
      return;
    }

    const confirmacion = confirm(
      `¿Estás seguro de que deseas eliminar este respaldo?\n\n` +
      `Tipo: ${this.getTipoLabel(respaldo.tipo)}\n` +
      `Fecha: ${this.formatDateTime(respaldo.fechaCreacion)}\n\n` +
      `Esta acción no se puede deshacer.`
    );

    if (confirmacion) {
      this.configuracionService.eliminarRespaldo(respaldo.id).subscribe({
        next: () => {
          this.toastService.showSuccess('Respaldo eliminado exitosamente');
          this.cargarRespaldos();
        },
        error: (error) => {
          this.toastService.showError('Error al eliminar respaldo');
          console.error('Error deleting backup:', error);
        }
      });
    }
  }

  verDetalles(respaldo: RespaldoSistema): void {
    this.respaldoSeleccionado = respaldo;
    this.mostrarModalDetalles = true;
  }

  actualizarLista(): void {
    this.cargarRespaldos();
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  cerrarModalDetalles(): void {
    this.mostrarModalDetalles = false;
    this.respaldoSeleccionado = null;
  }

  volver(): void {
    this.router.navigate(['/dashboard/configuraciones']);
  }

  // Utility methods
  trackByRespaldo(index: number, respaldo: RespaldoSistema): number {
    return respaldo.id;
  }

  getTipoLabel(tipo: TipoRespaldo): string {
    const labels = {
      'COMPLETO': 'Completo',
      'INCREMENTAL': 'Incremental',
      'CONFIGURACIONES': 'Configuraciones',
      'USUARIOS': 'Usuarios',
      'CLIENTES': 'Clientes'
    };
    return labels[tipo] || tipo;
  }

  getTipoColor(tipo: TipoRespaldo): string {
    const colors = {
      'COMPLETO': 'success',
      'INCREMENTAL': 'info',
      'CONFIGURACIONES': 'warning',
      'USUARIOS': 'primary',
      'CLIENTES': 'secondary'
    };
    return colors[tipo] || 'secondary';
  }

  getTipoIcon(tipo: TipoRespaldo): string {
    const iconos = {
      'COMPLETO': 'fas fa-database',
      'INCREMENTAL': 'fas fa-layer-group',
      'CONFIGURACIONES': 'fas fa-cogs',
      'USUARIOS': 'fas fa-users',
      'CLIENTES': 'fas fa-building'
    };
    return iconos[tipo] || 'fas fa-file';
  }

  getEstadoLabel(estado: EstadoRespaldo): string {
    const labels = {
      'EN_PROGRESO': 'En Progreso',
      'COMPLETADO': 'Completado',
      'FALLIDO': 'Fallido',
      'CANCELADO': 'Cancelado'
    };
    return labels[estado] || estado;
  }

  getEstadoColor(estado: EstadoRespaldo): string {
    const colors = {
      'EN_PROGRESO': 'primary',
      'COMPLETADO': 'success',
      'FALLIDO': 'danger',
      'CANCELADO': 'secondary'
    };
    return colors[estado] || 'secondary';
  }

  getEstadoIcon(estado: EstadoRespaldo): string {
    const iconos = {
      'EN_PROGRESO': 'fas fa-spinner fa-spin',
      'COMPLETADO': 'fas fa-check-circle',
      'FALLIDO': 'fas fa-exclamation-circle',
      'CANCELADO': 'fas fa-times-circle'
    };
    return iconos[estado] || 'fas fa-question-circle';
  }

  formatTamano(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDuracion(segundos: number): string {
    if (segundos < 60) return `${segundos}s`;
    const minutos = Math.floor(segundos / 60);
    const restoSegundos = segundos % 60;
    if (minutos < 60) return `${minutos}m ${restoSegundos}s`;
    const horas = Math.floor(minutos / 60);
    const restoMinutos = minutos % 60;
    return `${horas}h ${restoMinutos}m`;
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
      minute: '2-digit'
    });
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}