import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface ToastOptions {
  color: 'success' | 'error' | 'warning' | 'info';
  message: string;
  icon?: string; // FontAwesome icon class
  duration?: number;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) { }

  public show(options: ToastOptions): void {
    const config = {
      timeOut: options.duration || 3000,
      enableHtml: true,
      closeButton: true,
      progressBar: true,
    };

    // Construir el mensaje con icono si existe
    let message = options.message;
    if (options.icon) {
      message = `<i class="${options.icon}"></i> ${options.message}`;
    }

    // Mostrar el toast según el tipo
    switch (options.color) {
      case 'success':
        this.toastr.success(message, options.title || 'Éxito', config);
        break;
      case 'error':
        this.toastr.error(message, options.title || 'Error', config);
        break;
      case 'warning':
        this.toastr.warning(message, options.title || 'Advertencia', config);
        break;
      case 'info':
        this.toastr.info(message, options.title || 'Información', config);
        break;
      default:
        this.toastr.info(message, options.title, config);
    }
  }

  // Métodos adicionales para uso directo
  public success(message: string, title?: string, duration?: number): void {
    this.show({ color: 'success', message, title, duration });
  }

  public error(message: string, title?: string, duration?: number): void {
    this.show({ color: 'error', message, title, duration });
  }

  public warning(message: string, title?: string, duration?: number): void {
    this.show({ color: 'warning', message, title, duration });
  }

  public info(message: string, title?: string, duration?: number): void {
    this.show({ color: 'info', message, title, duration });
  }

  // Limpiar todos los toasts
  public clear(): void {
    this.toastr.clear();
  }

  // Alias para compatibilidad
  public showSuccess(message: string, title?: string): void {
    this.success(message, title);
  }

  public showError(message: string, title?: string): void {
    this.error(message, title);
  }

  public showWarning(message: string, title?: string): void {
    this.warning(message, title);
  }

  public showInfo(message: string, title?: string): void {
    this.info(message, title);
  }
}