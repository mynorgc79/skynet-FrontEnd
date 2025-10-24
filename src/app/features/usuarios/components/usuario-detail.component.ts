import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Usuario, RoleTipo } from '@core/interfaces';

@Component({
  selector: 'app-usuario-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <!-- Modal -->
    <div class="modal fade show" [style.display]="show ? 'block' : 'none'" tabindex="-1" role="dialog" 
         [attr.aria-hidden]="!show" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          
          <!-- Modal Header -->
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas" [class.fa-eye]="mode === 'view'" 
                            [class.fa-edit]="mode === 'edit'"
                            [class.fa-toggle-on]="mode === 'toggle'"></i>
              {{ getModalTitle() }}
            </h5>
            <button type="button" class="btn-close" (click)="closeModal()"></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <div *ngIf="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>

            <div *ngIf="!loading && usuario">
              
              <!-- Modo Ver -->
              <div *ngIf="mode === 'view'" class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Nombre:</label>
                  <p class="form-control-plaintext">{{ usuario.nombre }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Apellido:</label>
                  <p class="form-control-plaintext">{{ usuario.apellido }}</p>
                </div>
                <div class="col-md-12 mb-3">
                  <label class="form-label fw-bold">Email:</label>
                  <p class="form-control-plaintext">{{ usuario.email }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Teléfono:</label>
                  <p class="form-control-plaintext">{{ usuario.telefono || 'No registrado' }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Rol:</label>
                  <p class="form-control-plaintext">
                    <span class="badge" [class]="getRoleBadgeClass(usuario.rol)">
                      {{ getRoleLabel(usuario.rol) }}
                    </span>
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Estado:</label>
                  <p class="form-control-plaintext">
                    <span class="badge" [class]="usuario.activo ? 'bg-success' : 'bg-danger'">
                      {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Fecha de Creación:</label>
                  <p class="form-control-plaintext">{{ formatDate(usuario.fechaCreacion) }}</p>
                </div>
              </div>

              <!-- Modo Toggle (Activar/Desactivar) -->
              <div *ngIf="mode === 'toggle'" class="row">
                <div class="col-12 text-center">
                  <div class="alert" [class]="usuario.activo ? 'alert-warning' : 'alert-info'">
                    <h5>
                      <i [class]="usuario.activo ? 'fas fa-exclamation-triangle' : 'fas fa-question-circle'" class="me-2"></i>
                      {{ usuario.activo ? '¿Desactivar Usuario?' : '¿Activar Usuario?' }}
                    </h5>
                    <p class="mb-0">
                      {{ usuario.activo ? 'El usuario no podrá acceder al sistema' : 'El usuario podrá acceder al sistema nuevamente' }}
                    </p>
                  </div>
                  
                  <div class="user-info mt-4">
                    <div class="d-flex align-items-center justify-content-center mb-3">
                      <div class="avatar-circle me-3">
                        {{ getInitials(usuario.nombre, usuario.apellido) }}
                      </div>
                      <div class="text-start">
                        <h6 class="mb-1">{{ usuario.nombre }} {{ usuario.apellido }}</h6>
                        <small class="text-muted">{{ usuario.email }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modo Editar -->
              <form *ngIf="mode === 'edit'" [formGroup]="usuarioForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Nombre <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" formControlName="nombre"
                           [class.is-invalid]="usuarioForm.get('nombre')?.invalid && usuarioForm.get('nombre')?.touched">
                    <div class="invalid-feedback">
                      El nombre es requerido
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Apellido <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" formControlName="apellido"
                           [class.is-invalid]="usuarioForm.get('apellido')?.invalid && usuarioForm.get('apellido')?.touched">
                    <div class="invalid-feedback">
                      El apellido es requerido
                    </div>
                  </div>
                  <div class="col-md-12 mb-3">
                    <label class="form-label">Email <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" formControlName="email"
                           [class.is-invalid]="usuarioForm.get('email')?.invalid && usuarioForm.get('email')?.touched">
                    <div class="invalid-feedback">
                      Ingrese un email válido
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" formControlName="telefono">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Rol <span class="text-danger">*</span></label>
                    <select class="form-select" formControlName="rol"
                            [class.is-invalid]="usuarioForm.get('rol')?.invalid && usuarioForm.get('rol')?.touched">
                      <option value="">Seleccione un rol</option>
                      <option value="ADMINISTRADOR">Administrador</option>
                      <option value="SUPERVISOR">Supervisor</option>
                      <option value="TECNICO">Técnico</option>
                    </select>
                    <div class="invalid-feedback">
                      El rol es requerido
                    </div>
                  </div>
                </div>
              </form>

            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <!-- Footer para modo VER -->
            <div *ngIf="mode === 'view'" class="d-flex gap-2">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cerrar</button>
            </div>
            
            <!-- Footer para modo EDITAR -->
            <div *ngIf="mode === 'edit'" class="d-flex gap-2">
              <button type="button" class="btn btn-success" (click)="onSubmit()" [disabled]="usuarioForm.invalid || saving">
                <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                <i *ngIf="!saving" class="fas fa-save me-2"></i>
                {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
            </div>

            <!-- Footer para modo TOGGLE (activar/desactivar) -->
            <div *ngIf="mode === 'toggle'" class="d-flex gap-2">
              <button type="button" class="btn" 
                      [class]="usuario?.activo ? 'btn-danger' : 'btn-success'"
                      (click)="confirmToggleStatus()" [disabled]="saving">
                <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                <i *ngIf="!saving" [class]="usuario?.activo ? 'fas fa-ban' : 'fas fa-check'" class="me-2"></i>
                {{ saving ? 'Procesando...' : (usuario?.activo ? 'Confirmar Desactivar' : 'Confirmar Activar') }}
              </button>
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      z-index: 1050;
    }
    
    .form-control-plaintext {
      padding: 0.375rem 0;
      margin-bottom: 0;
      font-size: 1rem;
      line-height: 1.5;
      background-color: transparent;
      border: none;
    }
    
    .badge {
      font-size: 0.875em;
    }
    
    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      opacity: 0.5;
    }
    
    .btn-close:hover {
      opacity: 1;
    }

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
      font-size: 18px;
    }

    .user-info {
      background-color: #f8f9fa;
      border-radius: 0.5rem;
      padding: 1rem;
    }
  `]
})
export class UsuarioDetailComponent implements OnInit, OnChanges {
  
  @Input() show: boolean = false;
  @Input() usuarioId: number | null = null;
  @Input() mode: 'view' | 'edit' | 'toggle' = 'view';
  @Output() closed = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<Usuario>();

  private usuariosService = inject(UsuariosService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  usuario: Usuario | null = null;
  usuarioForm: FormGroup;
  loading = false;
  saving = false;
  originalUser: Usuario | null = null;

  constructor() {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      rol: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // El ngOnInit solo se ejecuta una vez
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Se ejecuta cada vez que cambian las propiedades de entrada
    if (changes['show'] && changes['show'].currentValue && this.usuarioId) {
      console.log('Modal abierto para usuario ID:', this.usuarioId, 'Modo:', this.mode);
      this.loadUsuario();
    }
    
    if (changes['usuarioId'] && changes['usuarioId'].currentValue && this.show) {
      console.log('Usuario ID cambió a:', this.usuarioId, 'Modo:', this.mode);
      this.loadUsuario();
    }
  }

  loadUsuario(): void {
    if (!this.usuarioId) {
      console.log('No hay usuarioId, no se puede cargar');
      return;
    }

    console.log('Cargando usuario con ID:', this.usuarioId);
    this.loading = true;
    this.usuariosService.getById(this.usuarioId).subscribe({
      next: (usuario) => {
        console.log('Usuario cargado exitosamente:', usuario);
        this.usuario = usuario;
        this.originalUser = { ...usuario };
        this.updateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando usuario:', error);
        this.toastService.showError('Error al cargar usuario');
        this.loading = false;
      }
    });
  }

  updateForm(): void {
    if (this.usuario) {
      this.usuarioForm.patchValue({
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        email: this.usuario.email,
        telefono: this.usuario.telefono,
        rol: this.usuario.rol
      });
    }
  }

  getModalTitle(): string {
    const titles = {
      'view': 'Detalle del Usuario',
      'edit': 'Editar Usuario',
      'toggle': 'Cambiar Estado del Usuario'
    };
    return titles[this.mode];
  }

  switchToEditMode(): void {
    this.mode = 'edit';
    this.updateForm();
  }

  cancelEdit(): void {
    this.mode = 'view';
    this.usuario = this.originalUser ? { ...this.originalUser } : null;
    this.updateForm();
  }

  confirmToggleStatus(): void {
    if (!this.usuario) return;

    const action = this.usuario.activo ? 'desactivar' : 'activar';
    this.saving = true;
    
    this.usuariosService.toggleStatus(this.usuario.idUsuario).subscribe({
      next: (updatedUser) => {
        this.usuario = updatedUser;
        this.originalUser = { ...updatedUser };
        this.saving = false;
        this.toastService.showSuccess(`Usuario ${action}do correctamente`);
        this.userUpdated.emit(updatedUser);
        this.closeModal();
      },
      error: (error) => {
        this.saving = false;
        this.toastService.showError(`Error al ${action} usuario`);
        console.error('Error toggling user status:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid || !this.usuario) return;

    this.saving = true;
    const formData = this.usuarioForm.value;

    this.usuariosService.update(this.usuario.idUsuario, formData).subscribe({
      next: (updatedUser) => {
        this.usuario = updatedUser;
        this.originalUser = { ...updatedUser };
        this.mode = 'view';
        this.saving = false;
        this.toastService.showSuccess('Usuario actualizado correctamente');
        this.userUpdated.emit(updatedUser);
      },
      error: (error) => {
        this.saving = false;
        this.toastService.showError('Error al actualizar usuario');
        console.error('Error updating user:', error);
      }
    });
  }

  toggleStatus(): void {
    if (!this.usuario) return;

    const action = this.usuario.activo ? 'desactivar' : 'activar';
    
    this.usuariosService.toggleStatus(this.usuario.idUsuario).subscribe({
      next: (updatedUser) => {
        this.usuario = updatedUser;
        this.originalUser = { ...updatedUser };
        this.toastService.showSuccess(`Usuario ${action}do correctamente`);
        this.userUpdated.emit(updatedUser);
      },
      error: (error) => {
        this.toastService.showError(`Error al ${action} usuario`);
        console.error('Error toggling user status:', error);
      }
    });
  }

  closeModal(): void {
    this.show = false;
    this.usuario = null;
    this.originalUser = null;
    this.mode = 'view';
    this.usuarioForm.reset();
    this.closed.emit();
  }

  // Utility methods
  getInitials(nombre: string, apellido: string): string {
    return (nombre.charAt(0) + apellido.charAt(0)).toUpperCase();
  }

  getRoleLabel(rol: RoleTipo): string {
    const labels = {
      'ADMINISTRADOR': 'Administrador',
      'SUPERVISOR': 'Supervisor',
      'TECNICO': 'Técnico'
    };
    return labels[rol] || rol;
  }

  getRoleBadgeClass(rol: RoleTipo): string {
    const classes = {
      'ADMINISTRADOR': 'bg-danger',
      'SUPERVISOR': 'bg-warning text-dark',
      'TECNICO': 'bg-info'
    };
    return classes[rol] || 'bg-secondary';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}