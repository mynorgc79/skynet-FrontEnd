import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { VisitasService } from '../services/visitas.service';
import { ClientesService } from '../../clientes/services/clientes.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Visita, VisitaCreateDTO, VisitaUpdateDTO, Cliente, Usuario } from '@core/interfaces';

@Component({
  selector: 'app-visita-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">{{ isEditing ? 'Editar Visita' : 'Nueva Visita' }}</h2>
              <p class="text-muted mb-0">{{ isEditing ? 'Modificar información de la visita' : 'Programar nueva visita técnica' }}</p>
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

      <div class="row">
        <div class="col-lg-8">
          <form [formGroup]="visitaForm" (ngSubmit)="onSubmit()">
            
            <!-- Información del Cliente -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-user me-2"></i>
                  Información del Cliente
                </h5>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Cliente *</label>
                    <select 
                      class="form-select"
                      formControlName="clienteId"
                      [class.is-invalid]="isFieldInvalid('clienteId')"
                      [class.is-valid]="isFieldValid('clienteId')"
                      (blur)="markFieldAsTouched('clienteId')">
                      <option value="">Seleccionar cliente</option>
                      <option *ngFor="let cliente of clientes" [value]="cliente.idCliente">
                        {{ cliente.nombre }} - {{ cliente.contacto }} ({{ cliente.tipoCliente }})
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6" *ngIf="selectedCliente">
                    <label class="form-label">Datos de Contacto</label>
                    <div class="form-control-plaintext">
                      <strong>{{ selectedCliente.nombre }} - {{ selectedCliente.contacto }}</strong><br>
                      <small class="text-muted">{{ selectedCliente.email }}</small><br>
                      <small class="text-muted">{{ selectedCliente.telefono }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detalles de la Visita -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-calendar-alt me-2"></i>
                  Detalles de la Visita
                </h5>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Tipo de Visita *</label>
                    <select 
                      class="form-select"
                      formControlName="tipoVisita"
                      [class.is-invalid]="isFieldInvalid('tipoVisita')"
                      [class.is-valid]="isFieldValid('tipoVisita')"
                      (blur)="markFieldAsTouched('tipoVisita')">
                      <option value="">Seleccionar tipo</option>
                      <option value="MANTENIMIENTO">🔧 Mantenimiento</option>
                      <option value="INSTALACION">🏗️ Instalación</option>
                      <option value="SOPORTE">🛠️ Soporte</option>
                      <option value="INSPECCION">🔍 Inspección</option>
                      <option value="REPARACION">⚡ Reparación</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Estado</label>
                    <select 
                      class="form-select"
                      formControlName="estado"
                      [disabled]="!isEditing">
                      <option value="PROGRAMADA">Programada</option>
                      <option value="EN_PROGRESO">En Progreso</option>
                      <option value="COMPLETADA">Completada</option>
                      <option value="CANCELADA">Cancelada</option>
                    </select>
                  </div>
                </div>
                
                <div class="row g-3 mt-2">
                  <div class="col-md-6">
                    <label class="form-label">Fecha de la visita *</label>
                    <input 
                      type="date" 
                      class="form-control"
                      formControlName="fechaVisita"
                      [min]="today"
                      [class.is-invalid]="isFieldInvalid('fechaVisita')">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Hora estimada</label>
                    <input 
                      type="time" 
                      class="form-control"
                      formControlName="horaEstimada">
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Fecha programada *</label>
                    <input 
                      type="date" 
                      class="form-control"
                      formControlName="fechaProgramada"
                      [min]="today"
                      [class.is-invalid]="isFieldInvalid('fechaProgramada')"
                      [class.is-valid]="isFieldValid('fechaProgramada')"
                      (blur)="markFieldAsTouched('fechaProgramada')">
                  </div>
                  <div class="col-md-6" *ngIf="currentUser?.rol !== 'TECNICO'">
                    <label class="form-label">Técnico asignado *</label>
                    <select 
                      class="form-select"
                      formControlName="tecnicoId"
                      [class.is-invalid]="isFieldInvalid('tecnicoId')"
                      [class.is-valid]="isFieldValid('tecnicoId')"
                      (blur)="markFieldAsTouched('tecnicoId')">
                      <option value="">Seleccionar técnico</option>
                      <option *ngFor="let tecnico of tecnicos" [value]="getUsuarioId(tecnico)">
                        {{ tecnico.nombre }} {{ tecnico.apellido }}
                      </option>
                    </select>
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('tecnicoId')">
                      Debe seleccionar un técnico para la visita
                    </div>
                  </div>
                </div>

                <div class="row g-3 mt-2" *ngIf="currentUser?.rol === 'ADMINISTRADOR'">
                  <div class="col-md-6">
                    <label class="form-label">Supervisor asignado</label>
                    <select 
                      class="form-select"
                      formControlName="supervisorId">
                      <option value="">Sin asignar</option>
                      <option *ngFor="let supervisor of supervisores" [value]="getUsuarioId(supervisor)">
                        {{ supervisor.nombre }} {{ supervisor.apellido }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="mt-3">
                  <label class="form-label">Descripción</label>
                  <textarea 
                    class="form-control" 
                    rows="4"
                    formControlName="descripcion"
                    placeholder="Detalles sobre la visita, equipos a revisar, etc."></textarea>
                </div>
                
                <div class="mt-3">
                  <label class="form-label">Observaciones</label>
                  <textarea 
                    class="form-control" 
                    rows="3"
                    formControlName="observaciones"
                    placeholder="Observaciones adicionales"></textarea>
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
                  <div class="col-md-12">
                    <label class="form-label">Dirección completa</label>
                    <input 
                      type="text" 
                      class="form-control"
                      formControlName="direccion"
                      placeholder="Dirección completa donde se realizará la visita">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Latitud</label>
                    <input 
                      type="number" 
                      class="form-control"
                      formControlName="latitud"
                      step="any"
                      placeholder="14.634915">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Longitud</label>
                    <input 
                      type="number" 
                      class="form-control"
                      formControlName="longitud"
                      step="any"
                      placeholder="-90.506882">
                  </div>
                  <div class="col-12">
                    <div class="alert alert-info">
                      <i class="fas fa-info-circle me-2"></i>
                      Si no proporciona coordenadas GPS, se utilizará la dirección del cliente registrada.
                    </div>
                    <div class="alert alert-warning" *ngIf="tecnicos.length === 0">
                      <i class="fas fa-exclamation-triangle me-2"></i>
                      No hay técnicos disponibles. 
                      <button class="btn btn-sm btn-outline-warning ms-2" type="button" (click)="debugTecnicos()">
                        Recargar Usuarios
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="card">
              <div class="card-body">
                <div class="d-flex gap-2 justify-content-end">
                  <button 
                    type="button" 
                    class="btn btn-secondary"
                    (click)="volver()">
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="visitaForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i *ngIf="!loading" class="fas fa-save me-2"></i>
                    {{ isEditing ? 'Actualizar Visita' : 'Programar Visita' }}
                  </button>
                </div>
              </div>
            </div>

          </form>
        </div>

        <!-- Sidebar con información adicional -->
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-lightbulb me-2"></i>
                Información
              </h6>
            </div>
            <div class="card-body">
              <div class="small">
                <p><strong>💡 Consejos:</strong></p>
                <ul class="ps-3">
                  <li>Seleccione la prioridad según la urgencia del servicio</li>
                  <li>Programe con al menos 24 horas de anticipación</li>
                  <li>Incluya detalles específicos en la descripción</li>
                  <li>Verifique la disponibilidad del técnico</li>
                </ul>
                
                <hr>
                
                <p><strong>⏰ Horarios recomendados:</strong></p>
                <ul class="ps-3">
                  <li>Mantenimiento: 8:00 AM - 12:00 PM</li>
                  <li>Emergencias: Cualquier horario</li>
                  <li>Instalaciones: 1:00 PM - 5:00 PM</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control:focus, .form-select:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
    
    .is-invalid {
      border-color: #dc3545 !important;
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
    
    .is-valid {
      border-color: #198754 !important;
      box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25) !important;
    }
    
    .invalid-feedback {
      display: block;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .valid-feedback {
      display: block;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      color: #198754;
    }
    
    .alert-info {
      background-color: #cff4fc;
      border-color: #b6effb;
      color: #055160;
    }
    
    .card-header h5, .card-header h6 {
      color: #495057;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .form-label {
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
  `]
})
export class VisitaFormComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private visitasService = inject(VisitasService);
  private clienteService = inject(ClientesService);
  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  visitaForm!: FormGroup;
  isEditing = false;
  loading = false;
  visitaId: number | null = null;
  
  clientes: Cliente[] = [];
  tecnicos: Usuario[] = [];
  supervisores: Usuario[] = [];
  selectedCliente: Cliente | null = null;
  currentUser: Usuario | null = null;
  
  today = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Validar permisos: solo ADMINISTRADORES y SUPERVISORES pueden crear/editar visitas
    if (this.currentUser?.rol === 'TECNICO') {
      this.toastService.showError('No tienes permisos para crear o editar visitas');
      this.router.navigate(['/dashboard/visitas']);
      return;
    }
    
    this.initForm();
    this.loadData();
    this.checkEditMode();
  }

  initForm(): void {
    this.visitaForm = this.fb.group({
      clienteId: ['', Validators.required],
      tipoVisita: ['', Validators.required],
      descripcion: [''],
      observaciones: [''],
      fechaProgramada: ['', Validators.required],
      fechaVisita: ['', Validators.required],
      horaEstimada: [''],
      direccion: [''],
      estado: ['PROGRAMADA'],
      tecnicoId: ['', Validators.required], // Hacer requerido siempre
      supervisorId: [''],
      latitud: [''],
      longitud: ['']
    });

    // Escuchar cambios en el cliente seleccionado
    this.visitaForm.get('clienteId')?.valueChanges.subscribe(clienteId => {
      this.selectedCliente = this.clientes.find(c => c.idCliente === +clienteId) || null;
      if (this.selectedCliente) {
        // Prellenar coordenadas y dirección del cliente
        this.visitaForm.patchValue({
          direccion: this.selectedCliente.direccion || '',
          latitud: this.selectedCliente.latitud || '',
          longitud: this.selectedCliente.longitud || ''
        });
      }
    });

    // Sincronizar fechaVisita con fechaProgramada
    this.visitaForm.get('fechaVisita')?.valueChanges.subscribe(fecha => {
      if (fecha) {
        this.visitaForm.patchValue({
          fechaProgramada: fecha
        }, { emitEvent: false });
      }
    });

    // Sincronizar fechaProgramada con fechaVisita  
    this.visitaForm.get('fechaProgramada')?.valueChanges.subscribe(fecha => {
      if (fecha) {
        this.visitaForm.patchValue({
          fechaVisita: fecha
        }, { emitEvent: false });
      }
    });

    // Si es técnico, auto-asignarse
    if (this.currentUser?.rol === 'TECNICO') {
      this.visitaForm.patchValue({
        tecnicoId: this.getUsuarioId(this.currentUser)
      });
    }
    
    // Si es supervisor, auto-asignarse como supervisor
    if (this.currentUser?.rol === 'SUPERVISOR' || this.currentUser?.rol === 'ADMINISTRADOR') {
      this.visitaForm.patchValue({
        supervisorId: this.getUsuarioId(this.currentUser)
      });
    }
  }

  loadData(): void {
    // Cargar clientes
    this.clienteService.getAll().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.toastService.showError('Error al cargar clientes');
      }
    });

    // Cargar técnicos - primero intentamos con getTecnicos(), si falla usamos getUsuarios
    this.usuarioService.getTecnicos().subscribe({
      next: (response) => {
        this.tecnicos = response.data || [];
        if (this.tecnicos.length === 0) {
          this.loadTecnicosFromAllUsers();
        }
      },
      error: (error) => {
        console.error('Error con getTecnicos(), intentando alternativa:', error);
        this.loadTecnicosFromAllUsers();
      }
    });

    // Cargar supervisores
    this.usuarioService.getSupervisores().subscribe({
      next: (response) => {
        this.supervisores = response.data || [];
      },
      error: (error) => {
        console.error('Error loading supervisors:', error);
      }
    });
  }

  loadTecnicosFromAllUsers(): void {
    // Método alternativo para cargar técnicos desde todos los usuarios
    this.usuarioService.getUsuarios(1, 100).subscribe({
      next: (response) => {
        const allUsers = response.data || [];
        this.tecnicos = allUsers.filter(user => user.rol === 'TECNICO' && user.activo);
        if (this.tecnicos.length === 0) {
          this.toastService.showError('No hay técnicos disponibles');
        }
      },
      error: (error) => {
        console.error('Error loading users for technicians:', error);
        this.toastService.showError('Error al cargar técnicos');
      }
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nueva') {
      this.isEditing = true;
      this.visitaId = +id;
      this.loadVisita();
    }
  }

  loadVisita(): void {
    if (!this.visitaId) return;
    
    this.loading = true;
    this.visitasService.getById(this.visitaId).subscribe({
      next: (visita) => {
        this.populateForm(visita);
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al cargar la visita');
        this.loading = false;
        console.error('Error loading visit:', error);
      }
    });
  }

  populateForm(visita: Visita): void {
    const fechaProgramada = new Date(visita.fechaProgramada).toISOString().split('T')[0];
    
    this.visitaForm.patchValue({
      clienteId: visita.clienteId,
      tipoVisita: visita.tipoVisita,
      descripcion: visita.descripcion || '',
      observaciones: visita.observaciones || '',
      fechaProgramada: fechaProgramada,
      fechaVisita: fechaProgramada, // Usar la misma fecha por defecto
      horaEstimada: '09:00', // Hora por defecto
      direccion: '', // Campo adicional para el formulario
      estado: visita.estado,
      tecnicoId: visita.tecnicoId || '',
      supervisorId: visita.supervisorId || '',
      latitud: visita.latitud || '',
      longitud: visita.longitud || ''
    });
  }

  onSubmit(): void {
    if (this.visitaForm.invalid) {
      this.visitaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    
    const formValue = this.visitaForm.value;
    
    if (this.isEditing && this.visitaId) {
      const updateData: VisitaUpdateDTO = {
        cliente: parseInt(formValue.clienteId),
        tipo_visita: formValue.tipoVisita,
        descripcion: formValue.descripcion,
        observaciones: formValue.observaciones,
        fecha_programada: this.formatDateTimeForBackend(formValue.fechaProgramada),
        tecnico: formValue.tecnicoId ? parseInt(formValue.tecnicoId) : undefined,
        supervisor: formValue.supervisorId ? parseInt(formValue.supervisorId) : undefined,
        latitud: formValue.latitud ? +formValue.latitud : undefined,
        longitud: formValue.longitud ? +formValue.longitud : undefined
      };
      
      this.visitasService.update(this.visitaId, updateData).subscribe({
        next: () => {
          this.toastService.showSuccess('Visita actualizada correctamente');
          this.router.navigate(['/dashboard/visitas']);
        },
        error: (error) => {
          this.toastService.showError('Error al actualizar la visita');
          this.loading = false;
          console.error('Error updating visit:', error);
        }
      });
    } else {
      const createData: VisitaCreateDTO = {
        cliente: parseInt(formValue.clienteId),
        tipo_visita: formValue.tipoVisita,
        descripcion: formValue.descripcion,
        observaciones: formValue.observaciones,
        fecha_programada: this.formatDateTimeForBackend(formValue.fechaProgramada),
        latitud: formValue.latitud ? +formValue.latitud : undefined,
        longitud: formValue.longitud ? +formValue.longitud : undefined
      };
      
      // Asignar técnico (requerido por el backend)
      if (formValue.tecnicoId && formValue.tecnicoId !== '') {
        const tecnicoIdParsed = parseInt(formValue.tecnicoId);
        
        if (!isNaN(tecnicoIdParsed)) {
          createData.tecnico = tecnicoIdParsed;
        } else {
          this.toastService.showError('ID de técnico inválido');
          this.loading = false;
          return;
        }
      } else {
        this.toastService.showError('Debe seleccionar un técnico para la visita');
        this.loading = false;
        return;
      }
      
      // Solo agregar supervisor si hay uno válido
      if (formValue.supervisorId && formValue.supervisorId !== '') {
        createData.supervisor = parseInt(formValue.supervisorId);
      } else if (this.currentUser?.idUsuario && ['SUPERVISOR', 'ADMINISTRADOR'].includes(this.currentUser.rol)) {
        createData.supervisor = this.getUsuarioId(this.currentUser);
      }
      
      this.visitasService.create(createData).subscribe({
        next: () => {
          this.toastService.showSuccess('Visita programada correctamente');
          this.router.navigate(['/dashboard/visitas']);
        },
        error: (error) => {
          console.error('Error creating visit:', error);
          this.loading = false;
          
          // Mostrar errores específicos del backend
          if (error.error && error.error.errors && typeof error.error.errors === 'object') {
            // Manejar errores de validación del backend
            Object.keys(error.error.errors).forEach(field => {
              const fieldErrors = error.error.errors[field];
              if (Array.isArray(fieldErrors)) {
                fieldErrors.forEach(errorMsg => {
                  this.toastService.showError(`${field}: ${errorMsg}`);
                });
              }
            });
          } else if (error.error && error.error.message) {
            // Mostrar mensaje de error del backend
            this.toastService.showError(error.error.message);
          } else if (error.message) {
            // Mostrar mensaje de error de HTTP
            this.toastService.showError(error.message);
          } else {
            // Mensaje genérico
            this.toastService.showError('Error al programar la visita');
          }
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.visitaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.visitaForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  markFieldAsTouched(fieldName: string): void {
    const field = this.visitaForm.get(fieldName);
    if (field) {
      field.markAsTouched();
    }
  }

  debugTecnicos(): void {
    this.loadData();
  }

  getUsuarioId(usuario: Usuario): number {
    // El backend envía 'id' pero la interface TypeScript espera 'idUsuario'
    return (usuario as any).id || usuario.idUsuario;
  }

  formatDateTimeForBackend(dateString: string): string {
    // Convierte fecha YYYY-MM-DD a formato ISO con hora por defecto
    const date = new Date(dateString + 'T09:00:00.000Z');
    return date.toISOString();
  }

  volver(): void {
    this.router.navigate(['/dashboard/visitas']);
  }
}