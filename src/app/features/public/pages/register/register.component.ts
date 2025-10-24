import { Component, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Importaciones de servicios
import { EyeBtnService } from '@shared/services/eye-btn.service';
import { AuthService, RegisterRequest } from '@core/services/auth.service';
import { ToastService } from '@shared/services/toast.service';
import { RoleTipo } from '@core/interfaces';

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
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  // Inyección de dependencias con inject()
  private eyeBtnService = inject(EyeBtnService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  public showPassword = this.eyeBtnService.showEye;
  public isLoading = false;

  // Opciones de roles
  public roles = [
    { value: RoleTipo.ADMINISTRADOR, label: 'Administrador' },
    { value: RoleTipo.SUPERVISOR, label: 'Supervisor' },
    { value: RoleTipo.TECNICO, label: 'Técnico' }
  ];

  public registerForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern(/^\d{8,15}$/)]],
    rol: [RoleTipo.TECNICO, [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: passwordMatchValidator
  });

  public onRegister(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const formData = this.registerForm.value;
      const registerData: RegisterRequest = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono || undefined,
        rol: formData.rol,
        password: formData.password,
        confirm_password: formData.confirmPassword
      };

      this.authService
        .register(registerData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (user) => {
            this.isLoading = false;
            this.toastService.show({
              color: 'success',
              message: `Usuario ${user.nombre} ${user.apellido} registrado exitosamente!`,
              icon: 'fas fa-check-circle',
              title: 'Registro exitoso',
              duration: 3000,
            });
            
            // Redirigir al login después del registro exitoso
            this.router.navigateByUrl('/login');
          },
          error: (message) => {
            this.isLoading = false;
            this.toastService.show({
              color: 'error',
              message,
              icon: 'fas fa-exclamation-triangle',
              title: 'Error en registro',
              duration: 4000,
            });
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  public togglePasswordVisibility(): void {
    this.eyeBtnService.toggle();
  }

  public navigateToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
