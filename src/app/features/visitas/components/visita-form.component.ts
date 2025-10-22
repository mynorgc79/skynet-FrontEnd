import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VisitasService } from '../services/visitas.service';
import { ClientesService } from '../../clientes/services/clientes.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Visita, VisitaCreateDTO, VisitaUpdateDTO, Cliente, Usuario } from '@core/interfaces';

@Component({
  selector: 'app-visita-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
                      formControlName="idCliente"
                      [class.is-invalid]="isFieldInvalid('idCliente')">
                      <option value="">Seleccionar cliente</option>
                      <option *ngFor="let cliente of clientes" [value]="cliente.idCliente">
                        {{ cliente.nombre }} {{ cliente.apellido }} - {{ cliente.empresa }}
                      </option>
                    </select>
                    <div class="invalid-feedback">
                      Debe seleccionar un cliente
                    </div>
                  </div>
                  <div class="col-md-6" *ngIf="selectedCliente">
                    <label class="form-label">Datos de Contacto</label>
                    <div class="form-control-plaintext">
                      <strong>{{ selectedCliente.nombre }} {{ selectedCliente.apellido }}</strong><br>
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
                    <label class="form-label">Motivo de la visita *</label>
                    <input 
                      type="text" 
                      class="form-control"
                      formControlName="motivo"
                      placeholder="Ej: Mantenimiento preventivo"
                      [class.is-invalid]="isFieldInvalid('motivo')">
                    <div class="invalid-feedback">
                      El motivo es obligatorio
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Prioridad *</label>
                    <select 
                      class="form-select"
                      formControlName="prioridad"
                      [class.is-invalid]="isFieldInvalid('prioridad')">
                      <option value="">Seleccionar prioridad</option>
                      <option value="URGENTE">🔴 Urgente</option>
                      <option value="ALTA">🟠 Alta</option>
                      <option value="MEDIA">🟡 Media</option>
                      <option value="BAJA">🟢 Baja</option>
                    </select>
                    <div class="invalid-feedback">
                      Debe seleccionar una prioridad
                    </div>
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
                    <div class="invalid-feedback">
                      La fecha es obligatoria
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Hora estimada</label>
                    <input 
                      type="time" 
                      class="form-control"
                      formControlName="horaEstimada">
                  </div>
                </div>

                <div class="row g-3 mt-2">
                  <div class="col-md-6">
                    <label class="form-label">Duración estimada (minutos)</label>
                    <select class="form-select" formControlName="duracionEstimada">
                      <option value="30">30 minutos</option>
                      <option value="60" selected>1 hora</option>
                      <option value="90">1.5 horas</option>
                      <option value="120">2 horas</option>
                      <option value="180">3 horas</option>
                      <option value="240">4 horas</option>
                    </select>
                  </div>
                  <div class="col-md-6" *ngIf="currentUser?.rol !== 'TECNICO'">
                    <label class="form-label">Técnico asignado</label>
                    <select 
                      class="form-select"
                      formControlName="idTecnico">
                      <option value="">Sin asignar</option>
                      <option *ngFor="let tecnico of tecnicos" [value]="tecnico.idUsuario">
                        {{ tecnico.nombre }} {{ tecnico.apellido }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="mt-3">
                  <label class="form-label">Descripción adicional</label>
                  <textarea 
                    class="form-control" 
                    rows="4"
                    formControlName="descripcion"
                    placeholder="Detalles adicionales sobre la visita, equipos a revisar, etc."></textarea>
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
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      display: block;
    }
    
    .alert-info {
      background-color: #cff4fc;
      border-color: #b6effb;
      color: #055160;
    }
    
    .card-header h5, .card-header h6 {
      color: #495057;
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
  selectedCliente: Cliente | null = null;
  currentUser: Usuario | null = null;
  
  today = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForm();
    this.loadData();
    this.checkEditMode();
  }

  initForm(): void {
    this.visitaForm = this.fb.group({
      idCliente: ['', Validators.required],
      motivo: ['', Validators.required],
      descripcion: [''],
      fechaVisita: ['', Validators.required],
      horaEstimada: ['09:00'],
      duracionEstimada: [60],
      prioridad: ['MEDIA', Validators.required],
      idTecnico: [''],
      direccion: [''],
      latitud: [''],
      longitud: ['']
    });

    // Escuchar cambios en el cliente seleccionado
    this.visitaForm.get('idCliente')?.valueChanges.subscribe(idCliente => {
      this.selectedCliente = this.clientes.find(c => c.idCliente === +idCliente) || null;
      if (this.selectedCliente) {
        // Prellenar dirección del cliente
        this.visitaForm.patchValue({
          direccion: this.selectedCliente.direccion || '',
          latitud: this.selectedCliente.latitud || '',
          longitud: this.selectedCliente.longitud || ''
        });
      }
    });

    // Si es técnico, auto-asignarse
    if (this.currentUser?.rol === 'TECNICO') {
      this.visitaForm.patchValue({
        idTecnico: this.currentUser.idUsuario
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
      }
    });

    // Cargar técnicos
    this.usuarioService.getByRol('TECNICO').subscribe({
      next: (tecnicos) => {
        this.tecnicos = tecnicos;
      },
      error: (error) => {
        console.error('Error loading technicians:', error);
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
    const fechaVisita = new Date(visita.fechaVisita).toISOString().split('T')[0];
    
    this.visitaForm.patchValue({
      idCliente: visita.idCliente,
      motivo: visita.motivo,
      descripcion: visita.descripcion || '',
      fechaVisita: fechaVisita,
      horaEstimada: visita.horaEstimada || '09:00',
      duracionEstimada: visita.duracionEstimada || 60,
      prioridad: visita.prioridad,
      idTecnico: visita.idTecnico || '',
      direccion: visita.direccion || '',
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
        ...formValue,
        fechaVisita: new Date(formValue.fechaVisita),
        latitud: formValue.latitud ? +formValue.latitud : undefined,
        longitud: formValue.longitud ? +formValue.longitud : undefined,
        idTecnico: formValue.idTecnico ? +formValue.idTecnico : undefined
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
        ...formValue,
        fechaVisita: new Date(formValue.fechaVisita),
        latitud: formValue.latitud ? +formValue.latitud : undefined,
        longitud: formValue.longitud ? +formValue.longitud : undefined,
        idTecnico: formValue.idTecnico ? +formValue.idTecnico : undefined,
        idSupervisor: this.currentUser?.idUsuario
      };
      
      this.visitasService.create(createData).subscribe({
        next: () => {
          this.toastService.showSuccess('Visita programada correctamente');
          this.router.navigate(['/dashboard/visitas']);
        },
        error: (error) => {
          this.toastService.showError('Error al programar la visita');
          this.loading = false;
          console.error('Error creating visit:', error);
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.visitaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  volver(): void {
    this.router.navigate(['/dashboard/visitas']);
  }
}