import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VisitasService } from '../services/visitas.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Visita, Usuario } from '@core/interfaces';

@Component({
  selector: 'app-visita-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">Detalle de Visita #{{ visita?.idVisita }}</h2>
              <p class="text-muted mb-0">Información completa de la visita técnica</p>
            </div>
            <div class="d-flex gap-2">
              <button 
                *ngIf="canEdit()"
                class="btn btn-outline-warning"
                (click)="editarVisita()">
                <i class="fas fa-edit me-2"></i>
                Editar
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

      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div *ngIf="!loading && visita" class="row">
        <!-- Información principal -->
        <div class="col-lg-8">
          
          <!-- Estado y acciones -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <div class="d-flex align-items-center gap-3">
                    <span class="badge fs-6 px-3 py-2" 
                          [class]="'bg-' + visitasService.getEstadoColor(visita.estado)">
                      {{ visitasService.getEstadoLabel(visita.estado) }}
                    </span>
                    <span class="badge fs-6 px-3 py-2" 
                          [class]="'bg-' + visitasService.getPrioridadColor(visita.prioridad)">
                      {{ visitasService.getPrioridadLabel(visita.prioridad) }}
                    </span>
                  </div>
                </div>
                <div class="col-md-6 text-end">
                  <div class="btn-group" *ngIf="canManage()">
                    <button 
                      *ngIf="visitasService.canIniciar(visita)"
                      class="btn btn-success"
                      (click)="iniciarVisita()">
                      <i class="fas fa-play me-2"></i>
                      Iniciar Visita
                    </button>
                    <button 
                      *ngIf="visitasService.canCompletar(visita)"
                      class="btn btn-info"
                      (click)="completarVisita()">
                      <i class="fas fa-check me-2"></i>
                      Completar
                    </button>
                    <button 
                      *ngIf="visitasService.canCancelar(visita)"
                      class="btn btn-danger"
                      (click)="cancelarVisita()">
                      <i class="fas fa-times me-2"></i>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Información de la visita -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-info-circle me-2"></i>
                Información de la Visita
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Motivo</label>
                  <p class="form-control-plaintext">{{ visita.motivo }}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Fecha y Hora</label>
                  <p class="form-control-plaintext">
                    {{ formatDate(visita.fechaVisita) }}
                    <span *ngIf="visita.horaEstimada" class="text-muted">a las {{ visita.horaEstimada }}</span>
                  </p>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Duración Estimada</label>
                  <p class="form-control-plaintext">{{ visitasService.formatDuration(visita.duracionEstimada || 60) }}</p>
                </div>
                <div class="col-md-6" *ngIf="visita.horaInicio || visita.horaFin">
                  <label class="form-label fw-semibold">Tiempo Real</label>
                  <p class="form-control-plaintext">
                    <span *ngIf="visita.horaInicio">
                      Inicio: {{ formatDateTime(visita.horaInicio) }}
                    </span>
                    <br *ngIf="visita.horaInicio && visita.horaFin">
                    <span *ngIf="visita.horaFin">
                      Fin: {{ formatDateTime(visita.horaFin) }}
                    </span>
                  </p>
                </div>
                <div class="col-12" *ngIf="visita.descripcion">
                  <label class="form-label fw-semibold">Descripción</label>
                  <p class="form-control-plaintext">{{ visita.descripcion }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Información del cliente -->
          <div class="card mb-4" *ngIf="visita.cliente">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-user me-2"></i>
                Información del Cliente
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Nombre</label>
                  <p class="form-control-plaintext">{{ visita.cliente.nombre }} {{ visita.cliente.apellido }}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Empresa</label>
                  <p class="form-control-plaintext">{{ visita.cliente.empresa || 'No especificada' }}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Email</label>
                  <p class="form-control-plaintext">
                    <a [href]="'mailto:' + visita.cliente.email">{{ visita.cliente.email }}</a>
                  </p>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Teléfono</label>
                  <p class="form-control-plaintext">
                    <a [href]="'tel:' + visita.cliente.telefono">{{ visita.cliente.telefono }}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Ubicación -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-map-marker-alt me-2"></i>
                Ubicación
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-semibold">Dirección</label>
                  <p class="form-control-plaintext">
                    {{ visita.direccion || visita.cliente?.direccion || 'No especificada' }}
                  </p>
                </div>
                <div class="col-md-6" *ngIf="visita.latitud && visita.longitud">
                  <label class="form-label fw-semibold">Coordenadas GPS</label>
                  <p class="form-control-plaintext">
                    {{ visita.latitud }}, {{ visita.longitud }}
                  </p>
                </div>
                <div class="col-md-6" *ngIf="visita.latitud && visita.longitud">
                  <label class="form-label fw-semibold">Acciones</label>
                  <div>
                    <a 
                      [href]="getGoogleMapsUrl()"
                      target="_blank"
                      class="btn btn-outline-primary btn-sm">
                      <i class="fas fa-map me-2"></i>
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Observaciones y notas -->
          <div class="card mb-4" *ngIf="visita.observaciones || visita.motivoCancelacion">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-sticky-note me-2"></i>
                Observaciones
              </h5>
            </div>
            <div class="card-body">
              <div *ngIf="visita.observaciones">
                <label class="form-label fw-semibold">Observaciones finales</label>
                <p class="form-control-plaintext">{{ visita.observaciones }}</p>
              </div>
              <div *ngIf="visita.motivoCancelacion" class="mt-3">
                <label class="form-label fw-semibold text-danger">Motivo de cancelación</label>
                <p class="form-control-plaintext text-danger">{{ visita.motivoCancelacion }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          
          <!-- Técnico asignado -->
          <div class="card mb-4" *ngIf="visita.tecnico">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-user-cog me-2"></i>
                Técnico Asignado
              </h6>
            </div>
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="avatar-circle me-3">
                  {{ getInitials(visita.tecnico.nombre, visita.tecnico.apellido) }}
                </div>
                <div>
                  <div class="fw-semibold">{{ visita.tecnico.nombre }} {{ visita.tecnico.apellido }}</div>
                  <small class="text-muted">{{ visita.tecnico.email }}</small><br>
                  <small class="text-muted">{{ visita.tecnico.telefono }}</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Supervisor -->
          <div class="card mb-4" *ngIf="visita.supervisor">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-user-tie me-2"></i>
                Supervisor
              </h6>
            </div>
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="avatar-circle me-3">
                  {{ getInitials(visita.supervisor.nombre, visita.supervisor.apellido) }}
                </div>
                <div>
                  <div class="fw-semibold">{{ visita.supervisor.nombre }} {{ visita.supervisor.apellido }}</div>
                  <small class="text-muted">{{ visita.supervisor.email }}</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Información de tiempo -->
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-clock me-2"></i>
                Información de Tiempo
              </h6>
            </div>
            <div class="card-body">
              <div class="small">
                <div class="d-flex justify-content-between mb-2">
                  <span>Creada:</span>
                  <span>{{ formatDateTime(visita.fechaCreacion) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Actualizada:</span>
                  <span>{{ formatDateTime(visita.fechaActualizacion) }}</span>
                </div>
                <div *ngIf="getTiempoTranscurrido()" class="d-flex justify-content-between">
                  <span>Duración real:</span>
                  <span class="fw-semibold">{{ getTiempoTranscurrido() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline de estados -->
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-history me-2"></i>
                Historial
              </h6>
            </div>
            <div class="card-body">
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-marker bg-primary"></div>
                  <div class="timeline-content">
                    <small class="text-muted">{{ formatDateTime(visita.fechaCreacion) }}</small>
                    <div>Visita programada</div>
                  </div>
                </div>
                <div class="timeline-item" *ngIf="visita.horaInicio">
                  <div class="timeline-marker bg-warning"></div>
                  <div class="timeline-content">
                    <small class="text-muted">{{ formatDateTime(visita.horaInicio) }}</small>
                    <div>Visita iniciada</div>
                  </div>
                </div>
                <div class="timeline-item" *ngIf="visita.horaFin">
                  <div class="timeline-marker bg-success"></div>
                  <div class="timeline-content">
                    <small class="text-muted">{{ formatDateTime(visita.horaFin) }}</small>
                    <div>Visita completada</div>
                  </div>
                </div>
                <div class="timeline-item" *ngIf="visita.motivoCancelacion">
                  <div class="timeline-marker bg-danger"></div>
                  <div class="timeline-content">
                    <small class="text-muted">{{ formatDateTime(visita.fechaActualizacion) }}</small>
                    <div>Visita cancelada</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Error state -->
      <div *ngIf="!loading && !visita" class="text-center py-5">
        <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
        <h5 class="text-muted">Visita no encontrada</h5>
        <p class="text-muted">La visita solicitada no existe o no tienes permisos para verla</p>
        <button class="btn btn-primary" (click)="volver()">Volver a la lista</button>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.1rem;
    }
    
    .timeline {
      position: relative;
      padding-left: 30px;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 20px;
      bottom: 20px;
      width: 2px;
      background: #dee2e6;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 20px;
    }
    
    .timeline-marker {
      position: absolute;
      left: -22px;
      top: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .timeline-content {
      background: #f8f9fa;
      padding: 10px 15px;
      border-radius: 8px;
      border-left: 3px solid #dee2e6;
    }
    
    .badge.fs-6 {
      font-size: 0.9rem !important;
    }
    
    .form-control-plaintext {
      padding-left: 0;
      margin-bottom: 0;
    }
  `]
})
export class VisitaDetailComponent implements OnInit {
  
  visitasService = inject(VisitasService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  visita: Visita | null = null;
  loading = false;
  currentUser: Usuario | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadVisita();
  }

  loadVisita(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/dashboard/visitas']);
      return;
    }

    this.loading = true;
    this.visitasService.getById(+id).subscribe({
      next: (visita) => {
        this.visita = visita;
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al cargar la visita');
        this.loading = false;
        console.error('Error loading visit:', error);
      }
    });
  }

  canEdit(): boolean {
    if (!this.visita) return false;
    return this.visitasService.canEdit(this.visita) && this.canManage();
  }

  canManage(): boolean {
    if (!this.visita || !this.currentUser) return false;
    
    if (this.currentUser.rol === 'ADMINISTRADOR') return true;
    if (this.currentUser.rol === 'SUPERVISOR') return this.visita.idSupervisor === this.currentUser.idUsuario;
    if (this.currentUser.rol === 'TECNICO') return this.visita.idTecnico === this.currentUser.idUsuario;
    
    return false;
  }

  iniciarVisita(): void {
    if (!this.visita) return;
    
    this.visitasService.iniciar(this.visita.idVisita).subscribe({
      next: (updatedVisita) => {
        this.visita = updatedVisita;
        this.toastService.showSuccess('Visita iniciada correctamente');
      },
      error: (error) => {
        this.toastService.showError('Error al iniciar visita');
        console.error('Error starting visit:', error);
      }
    });
  }

  completarVisita(): void {
    if (!this.visita) return;
    
    const observaciones = prompt('Observaciones finales (opcional):');
    
    this.visitasService.completar(this.visita.idVisita, observaciones || undefined).subscribe({
      next: (updatedVisita) => {
        this.visita = updatedVisita;
        this.toastService.showSuccess('Visita completada correctamente');
      },
      error: (error) => {
        this.toastService.showError('Error al completar visita');
        console.error('Error completing visit:', error);
      }
    });
  }

  cancelarVisita(): void {
    if (!this.visita) return;
    
    const motivo = prompt('Motivo de cancelación:');
    if (motivo) {
      this.visitasService.cancelar(this.visita.idVisita, motivo).subscribe({
        next: (updatedVisita) => {
          this.visita = updatedVisita;
          this.toastService.showSuccess('Visita cancelada correctamente');
        },
        error: (error) => {
          this.toastService.showError('Error al cancelar visita');
          console.error('Error canceling visit:', error);
        }
      });
    }
  }

  editarVisita(): void {
    if (this.visita) {
      this.router.navigate(['/dashboard/visitas', this.visita.idVisita, 'editar']);
    }
  }

  volver(): void {
    this.router.navigate(['/dashboard/visitas']);
  }

  // Utility methods
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  formatDateTime(date?: string | Date): string {
    if (!date) return '';
    const d = (date instanceof Date) ? date : new Date(date);
    return d.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getInitials(nombre: string, apellido: string): string {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }

  getGoogleMapsUrl(): string {
    if (!this.visita?.latitud || !this.visita?.longitud) return '#';
    return `https://www.google.com/maps?q=${this.visita.latitud},${this.visita.longitud}`;
  }

  getTiempoTranscurrido(): string | null {
    if (!this.visita?.horaInicio || !this.visita?.horaFin) return null;
    
    const inicio = new Date(this.visita.horaInicio);
    const fin = new Date(this.visita.horaFin);
    const diffMs = fin.getTime() - inicio.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}