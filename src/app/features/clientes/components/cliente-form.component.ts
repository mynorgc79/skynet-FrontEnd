import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from '../services/clientes.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Cliente, ClienteCreateDTO, ClienteUpdateDTO } from '@core/interfaces';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-building me-2"></i>
                {{ isEditMode ? 'Editar Cliente' : 'Nuevo Cliente' }}
              </h5>
            </div>
            <div class="card-body">
              <!-- Loading indicator -->
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>

              <!-- Formulario -->
              <form *ngIf="!loading" [formGroup]="clienteForm" (ngSubmit)="onSubmit()">
                <div class="row g-3">
                  <!-- Información básica -->
                  <div class="col-12">
                    <h6 class="text-muted mb-3">
                      <i class="fas fa-info-circle me-2"></i>
                      Información Básica
                    </h6>
                  </div>

                  <div class="col-md-6">
                    <label for="nombre" class="form-label">Nombre/Empresa *</label>
                    <input 
                      type="text" 
                      class="form-control"
                      id="nombre"
                      formControlName="nombre"
                      placeholder="Nombre de la empresa o cliente">
                    <div *ngIf="clienteForm.get('nombre')?.invalid && clienteForm.get('nombre')?.touched" 
                         class="text-danger small mt-1">
                      El nombre es requerido
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="contacto" class="form-label">Persona de Contacto *</label>
                    <input 
                      type="text" 
                      class="form-control"
                      id="contacto"
                      formControlName="contacto"
                      placeholder="Nombre del contacto principal">
                    <div *ngIf="clienteForm.get('contacto')?.invalid && clienteForm.get('contacto')?.touched" 
                         class="text-danger small mt-1">
                      El contacto es requerido
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="email" class="form-label">Email *</label>
                    <input 
                      type="email" 
                      class="form-control"
                      id="email"
                      formControlName="email"
                      placeholder="correo@ejemplo.com">
                    <div *ngIf="clienteForm.get('email')?.invalid && clienteForm.get('email')?.touched" 
                         class="text-danger small mt-1">
                      <span *ngIf="clienteForm.get('email')?.errors?.['required']">El email es requerido</span>
                      <span *ngIf="clienteForm.get('email')?.errors?.['email']">Formato de email inválido</span>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="telefono" class="form-label">Teléfono</label>
                    <input 
                      type="tel" 
                      class="form-control"
                      id="telefono"
                      formControlName="telefono"
                      placeholder="+502 1234-5678">
                  </div>

                  <div class="col-md-6">
                    <label for="tipoCliente" class="form-label">Tipo de Cliente *</label>
                    <select 
                      class="form-select"
                      id="tipoCliente"
                      formControlName="tipoCliente">
                      <option value="">Seleccionar tipo</option>
                      <option value="INDIVIDUAL">Individual</option>
                      <option value="CORPORATIVO">Corporativo</option>
                    </select>
                    <div *ngIf="clienteForm.get('tipoCliente')?.invalid && clienteForm.get('tipoCliente')?.touched" 
                         class="text-danger small mt-1">
                      El tipo de cliente es requerido
                    </div>
                  </div>

                  <!-- Ubicación -->
                  <div class="col-12 mt-4">
                    <h6 class="text-muted mb-3">
                      <i class="fas fa-map-marker-alt me-2"></i>
                      Ubicación
                    </h6>
                  </div>

                  <div class="col-12">
                    <label for="direccion" class="form-label">Dirección *</label>
                    <textarea 
                      class="form-control"
                      id="direccion"
                      formControlName="direccion"
                      rows="2"
                      placeholder="Dirección completa del cliente"></textarea>
                    <div *ngIf="clienteForm.get('direccion')?.invalid && clienteForm.get('direccion')?.touched" 
                         class="text-danger small mt-1">
                      La dirección es requerida
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="latitud" class="form-label">Latitud *</label>
                    <input 
                      type="number" 
                      class="form-control"
                      id="latitud"
                      formControlName="latitud"
                      step="any"
                      placeholder="14.634915">
                    <div *ngIf="clienteForm.get('latitud')?.invalid && clienteForm.get('latitud')?.touched" 
                         class="text-danger small mt-1">
                      La latitud es requerida
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="longitud" class="form-label">Longitud *</label>
                    <input 
                      type="number" 
                      class="form-control"
                      id="longitud"
                      formControlName="longitud"
                      step="any"
                      placeholder="-90.506882">
                    <div *ngIf="clienteForm.get('longitud')?.invalid && clienteForm.get('longitud')?.touched" 
                         class="text-danger small mt-1">
                      La longitud es requerida
                    </div>
                  </div>

                  <!-- Botones -->
                  <div class="col-12 mt-4">
                    <div class="d-flex gap-2">
                      <button 
                        type="button"
                        class="btn btn-secondary"
                        (click)="cancelar()">
                        <i class="fas fa-times me-2"></i>
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        class="btn btn-primary"
                        [disabled]="clienteForm.invalid || submitting">
                        <i *ngIf="!submitting" [class]="isEditMode ? 'fas fa-save' : 'fas fa-plus'" class="me-2"></i>
                        <i *ngIf="submitting" class="fas fa-spinner fa-spin me-2"></i>
                        {{ submitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear Cliente') }}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-label {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .text-danger {
      font-size: 0.875em;
    }
    
    h6.text-muted {
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 0.5rem;
    }
  `]
})
export class ClienteFormComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientesService = inject(ClientesService);
  private toastService = inject(ToastService);

  clienteForm!: FormGroup;
  loading = false;
  submitting = false;
  isEditMode = false;
  clienteId?: number;
  
  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      contacto: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      tipoCliente: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      latitud: ['', [Validators.required]],
      longitud: ['', [Validators.required]]
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clienteId = +params['id'];
        this.loadCliente();
      }
    });
  }

  loadCliente(): void {
    if (!this.clienteId) return;
    
    this.loading = true;
    this.clientesService.getById(this.clienteId).subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue({
          nombre: cliente.nombre,
          contacto: cliente.contacto,
          email: cliente.email,
          telefono: cliente.telefono,
          tipoCliente: cliente.tipoCliente,
          direccion: cliente.direccion,
          latitud: cliente.latitud,
          longitud: cliente.longitud
        });
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al cargar el cliente');
        this.loading = false;
        console.error('Error loading cliente:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const formData = this.clienteForm.value;

    if (this.isEditMode && this.clienteId) {
      // Actualizar cliente existente
      const updateData: ClienteUpdateDTO = formData;
      this.clientesService.update(this.clienteId, updateData).subscribe({
        next: (cliente) => {
          this.toastService.showSuccess('Cliente actualizado correctamente');
          this.router.navigate(['/dashboard/clientes', cliente.idCliente]);
          this.submitting = false;
        },
        error: (error) => {
          this.toastService.showError('Error al actualizar el cliente');
          this.submitting = false;
          console.error('Error updating cliente:', error);
        }
      });
    } else {
      // Crear nuevo cliente
      const createData: ClienteCreateDTO = formData;
      this.clientesService.create(createData).subscribe({
        next: (cliente) => {
          this.toastService.showSuccess('Cliente creado correctamente');
          this.router.navigate(['/dashboard/clientes']);
          this.submitting = false;
        },
        error: (error) => {
          this.toastService.showError('Error al crear el cliente');
          this.submitting = false;
          console.error('Error creating cliente:', error);
        }
      });
    }
  }

  cancelar(): void {
    if (this.isEditMode && this.clienteId) {
      this.router.navigate(['/dashboard/clientes', this.clienteId]);
    } else {
      this.router.navigate(['/dashboard/clientes']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.clienteForm.controls).forEach(key => {
      const control = this.clienteForm.get(key);
      control?.markAsTouched();
    });
  }
}