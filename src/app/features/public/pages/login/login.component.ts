import { Component, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Importaciones de servicios
import { EyeBtnService } from '@shared/services/eye-btn.service';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  // Inyección de dependencias con inject()
  private eyeBtnService = inject(EyeBtnService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  public showPassword = this.eyeBtnService.showEye;

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public onLogin(): void {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            // Guardar token si es necesario
            localStorage.setItem('token', response.token);
            this.toastService.show({
              color: 'success',
              message: `Bienvenido ${response.user.name}!`,
              duration: 3000,
            });
            this.router.navigateByUrl('/dashboard');
          },
          error: (message) => {
            this.toastService.show({
              color: 'error',
              message,
              duration: 4000,
            });
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  public togglePasswordVisibility(): void {
    this.eyeBtnService.toggle();
  }
}
