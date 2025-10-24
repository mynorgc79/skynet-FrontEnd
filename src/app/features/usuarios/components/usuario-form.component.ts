import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Servicios e interfaces
import { AuthService, RegisterRequest } from '@core/services/auth.service';
import { UsuariosService } from '../services/usuarios.service';
import { ToastService } from '@shared/services/toast.service';
import { EyeBtnService } from '@shared/services/eye-btn.service';
import { Usuario, RoleTipo } from '@core/interfaces';

// Validador personalizado para confirmar contraseña
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  
  return null;
}

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">{{ isEditMode ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
              <p class="text-muted mb-0">{{ isEditMode ? 'Modificar información del usuario' : 'Registrar nuevo usuario en el sistema' }}</p>
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

      <!-- Formulario -->
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="fas fa-user-plus me-2"></i>
                Información del Usuario
              </h5>
            </div>
            
            <div class="card-body p-4">
              <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()" novalidate>
                
                <!-- Información Personal -->
                <div class="row mb-4">
                  <div class="col-12">
                    <h6 class="text-primary mb-3">
                      <i class="fas fa-user me-2"></i>
                      Información Personal
                    </h6>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="nombre" class="form-label">
                      Nombre *
                    </label>
                    <input 
                      type="text" 
                      class="form-control"
                      [class.is-invalid]="usuarioForm.get('nombre')?.invalid && usuarioForm.get('nombre')?.touched"
                      id="nombre" 
                      formControlName="nombre"
                      placeholder="Ingresa el nombre">
                    <div class="invalid-feedback" *ngIf="usuarioForm.get('nombre')?.invalid && usuarioForm.get('nombre')?.touched">
                      <small *ngIf="usuarioForm.get('nombre')?.errors?.['required']">
                        El nombre es requerido
                      </small>
                      <small *ngIf="usuarioForm.get('nombre')?.errors?.['minlength']">
                        Mínimo 2 caracteres
                      </small>
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="apellido" class="form-label">
                      Apellido *
                    </label>
                    <input 
                      type="text" 
                      class="form-control"
                      [class.is-invalid]="usuarioForm.get('apellido')?.invalid && usuarioForm.get('apellido')?.touched"
                      id="apellido" 
                      formControlName="apellido"
                      placeholder="Ingresa el apellido">
                    <div class="invalid-feedback" *ngIf="usuarioForm.get('apellido')?.invalid && usuarioForm.get('apellido')?.touched">
                      <small *ngIf="usuarioForm.get('apellido')?.errors?.['required']">
                        El apellido es requerido
                      </small>
                      <small *ngIf="usuarioForm.get('apellido')?.errors?.['minlength']">
                        Mínimo 2 caracteres
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Información de Contacto -->
                <div class="row mb-4">
                  <div class="col-12">
                    <h6 class="text-primary mb-3">
                      <i class="fas fa-envelope me-2"></i>
                      Información de Contacto
                    </h6>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">
                      Correo Electrónico *
                    </label>
                    <input 
                      type="email" 
                      class="form-control"
                      [class.is-invalid]="usuarioForm.get('email')?.invalid && usuarioForm.get('email')?.touched"
                      id="email" 
                      formControlName="email"
                      placeholder="correo@ejemplo.com">
                    <div class="invalid-feedback" *ngIf="usuarioForm.get('email')?.invalid && usuarioForm.get('email')?.touched">
                      <small *ngIf="usuarioForm.get('email')?.errors?.['required']">
                        El correo es requerido
                      </small>
                      <small *ngIf="usuarioForm.get('email')?.errors?.['email']">
                        Formato de correo inválido
                      </small>
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="telefono" class="form-label">
                      Teléfono
                    </label>
                    <input 
                      type="tel" 
                      class="form-control"
                      [class.is-invalid]="usuarioForm.get('telefono')?.invalid && usuarioForm.get('telefono')?.touched"
                      id="telefono" 
                      formControlName="telefono"
                      placeholder="12345678">
                    <div class="invalid-feedback" *ngIf="usuarioForm.get('telefono')?.invalid && usuarioForm.get('telefono')?.touched">
                      <small *ngIf="usuarioForm.get('telefono')?.errors?.['pattern']">
                        Formato de teléfono inválido (8-15 dígitos)
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Información del Sistema -->
                <div class="row mb-4">
                  <div class="col-12">
                    <h6 class="text-primary mb-3">
                      <i class="fas fa-cog me-2"></i>
                      Información del Sistema
                    </h6>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="rol" class="form-label">
                      Rol *
                    </label>
                    <select 
                      class="form-select"
                      [class.is-invalid]="usuarioForm.get('rol')?.invalid && usuarioForm.get('rol')?.touched"
                      id="rol" 
                      formControlName="rol">
                      <option value="">Selecciona un rol</option>
                      <option *ngFor="let rol of roles" [value]="rol.value">
                        {{ rol.label }}
                      </option>
                    </select>
                    <div class="invalid-feedback" *ngIf="usuarioForm.get('rol')?.invalid && usuarioForm.get('rol')?.touched">
                      <small *ngIf="usuarioForm.get('rol')?.errors?.['required']">
                        El rol es requerido
                      </small>
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3" *ngIf="usuarioForm.get('rol')?.value === 'TECNICO'">
                    <label for="idSupervisor" class="form-label">
                      Supervisor
                    </label>
                    <select 
                      class="form-select"
                      id="idSupervisor" 
                      formControlName="idSupervisor">
                      <option value="">Sin supervisor asignado</option>
                      <option *ngFor="let supervisor of supervisores" [value]="supervisor.idUsuario">
                        {{ supervisor.nombre }} {{ supervisor.apellido }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Contraseña (solo para nuevo usuario) -->
                <div class="row mb-4" *ngIf="!isEditMode">
                  <div class="col-12">
                    <h6 class="text-primary mb-3">
                      <i class="fas fa-lock me-2"></i>
                      Credenciales de Acceso
                    </h6>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="password" class="form-label">
                      Contraseña *
                    </label>
                    <div class="input-group">
                      <input 
                        [type]="showPassword() ? 'text' : 'password'" 
                        class="form-control"
                        [class.is-invalid]="usuarioForm.get('password')?.invalid && usuarioForm.get('password')?.touched"
                        id="password" 
                        formControlName="password"
                        placeholder="Mínimo 6 caracteres">
                      <button 
                        class="btn btn-outline-secondary" 
                        type="button" 
                        (click)="togglePasswordVisibility()">
                        <i [class]="showPassword() ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback" *ngIf="usuarioForm.get('password')?.invalid && usuarioForm.get('password')?.touched">
                      <small *ngIf="usuarioForm.get('password')?.errors?.['required']">
                        La contraseña es requerida
                      </small>
                      <small *ngIf="usuarioForm.get('password')?.errors?.['minlength']">
                        Mínimo 6 caracteres
                      </small>
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="confirmPassword" class="form-label">
                      Confirmar Contraseña *
                    </label>
                    <input 
                      type="password" 
                      class="form-control"
                      [class.is-invalid]="usuarioForm.get('confirmPassword')?.invalid && usuarioForm.get('confirmPassword')?.touched"
                      id="confirmPassword" 
                      formControlName="confirmPassword"
                      placeholder="Confirma la contraseña">
                    <div class="invalid-feedback" *ngIf="usuarioForm.get('confirmPassword')?.invalid && usuarioForm.get('confirmPassword')?.touched">
                      <small *ngIf="usuarioForm.get('confirmPassword')?.errors?.['required']">
                        Debes confirmar la contraseña
                      </small>
                      <small *ngIf="usuarioForm.get('confirmPassword')?.errors?.['passwordMismatch']">
                        Las contraseñas no coinciden
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Botones de acción -->
                <div class="d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    (click)="volver()">
                    <i class="fas fa-times me-2"></i>
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="usuarioForm.invalid || isLoading">
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i *ngIf="!isLoading" class="fas fa-save me-2"></i>
                    {{ isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear Usuario') }}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
    }
    
    .form-label {
      font-weight: 600;
    }
    
    .text-primary {
      color: #0d6efd !important;
    }
    
    .invalid-feedback {
      display: block;
    }
    
    .btn-group .btn {
      border-radius: 0.375rem;
    }
  `]
})
export class UsuarioFormComponent implements OnInit {
  
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);
  private toastService = inject(ToastService);
  private eyeBtnService = inject(EyeBtnService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  // Propiedades del componente
  usuarioForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  usuarioId?: number;
  supervisores: Usuario[] = [];
  
  public showPassword = this.eyeBtnService.showEye;

  // Opciones de roles
  public roles = [
    { value: RoleTipo.ADMINISTRADOR, label: 'Administrador' },
    { value: RoleTipo.SUPERVISOR, label: 'Supervisor' },
    { value: RoleTipo.TECNICO, label: 'Técnico' }
  ];

  ngOnInit(): void {
    // Verificar si es modo edición
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.usuarioId;
    
    this.initializeForm();
    this.loadSupervisores();
    
    if (this.isEditMode) {
      this.loadUsuario();
    }
  }

  private initializeForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^\d{8,15}$/)]],
      rol: ['', [Validators.required]],
      idSupervisor: [''],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', this.isEditMode ? [] : [Validators.required]]
    });

    // Agregar validador personalizado solo para modo creación
    if (!this.isEditMode) {
      this.usuarioForm.setValidators(passwordMatchValidator);
    }
  }

  private loadSupervisores(): void {
    this.authService.getUsuarios()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (usuarios) => {
          this.supervisores = usuarios.filter(u => 
            u.rol === RoleTipo.SUPERVISOR || u.rol === RoleTipo.ADMINISTRADOR
          );
        },
        error: (error) => {
          console.error('Error loading supervisors:', error);
        }
      });
  }

  private loadUsuario(): void {
    if (!this.usuarioId) return;
    
    this.isLoading = true;
    this.usuariosService.getById(this.usuarioId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (usuario) => {
          this.usuarioForm.patchValue({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            telefono: usuario.telefono,
            rol: usuario.rol,
            idSupervisor: usuario.idSupervisor
          });
          this.isLoading = false;
        },
        error: (error) => {
          this.toastService.show({
            color: 'error',
            message: 'Error al cargar usuario',
            icon: 'fas fa-exclamation-triangle',
            title: 'Error',
            duration: 4000,
          });
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      this.isLoading = true;
      
      if (this.isEditMode) {
        this.updateUsuario();
      } else {
        this.createUsuario();
      }
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }

  private createUsuario(): void {
    const formData = this.usuarioForm.value;
    const registerData: RegisterRequest = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono || undefined,
      rol: formData.rol,
      password: formData.password,
      confirm_password: formData.confirmPassword
    };

    this.authService.register(registerData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (usuario) => {
          this.isLoading = false;
          this.toastService.show({
            color: 'success',
            message: `Usuario ${usuario.nombre} ${usuario.apellido} creado exitosamente!`,
            icon: 'fas fa-check-circle',
            title: 'Usuario creado',
            duration: 3000,
          });
          this.router.navigate(['/dashboard/usuarios']);
        },
        error: (message) => {
          this.isLoading = false;
          this.toastService.show({
            color: 'error',
            message,
            icon: 'fas fa-exclamation-triangle',
            title: 'Error al crear usuario',
            duration: 4000,
          });
        }
      });
  }

  private updateUsuario(): void {
    if (!this.usuarioId) return;
    
    const formData = this.usuarioForm.value;
    const updateData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      rol: formData.rol,
      idSupervisor: formData.idSupervisor
    };

    this.usuariosService.update(this.usuarioId, updateData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (usuario) => {
          this.isLoading = false;
          this.toastService.show({
            color: 'success',
            message: `Usuario actualizado exitosamente!`,
            icon: 'fas fa-check-circle',
            title: 'Usuario actualizado',
            duration: 3000,
          });
          this.router.navigate(['/dashboard/usuarios']);
        },
        error: (message) => {
          this.isLoading = false;
          this.toastService.show({
            color: 'error',
            message,
            icon: 'fas fa-exclamation-triangle',
            title: 'Error al actualizar usuario',
            duration: 4000,
          });
        }
      });
  }

  togglePasswordVisibility(): void {
    this.eyeBtnService.toggle();
  }

  volver(): void {
    this.router.navigate(['/dashboard/usuarios']);
  }
}