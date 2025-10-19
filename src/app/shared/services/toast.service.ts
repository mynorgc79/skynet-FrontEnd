import { Injectable } from '@angular/core';

export interface ToastOptions {
  color: 'success' | 'error' | 'warning' | 'info';
  message: string;
  icon?: any; // FontAwesome icon
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  public show(options: ToastOptions): void {
    // Implementación temporal con console.log
    // Reemplazar con tu implementación de toasts real
    console.log(`[${options.color.toUpperCase()}] ${options.message}`);
    
    // Aquí podrías integrar con librerías como:
    // - Angular Material Snackbar
    // - NgBootstrap Toast
    // - Ngx-Toastr
    // - O tu implementación custom
    
    if (options.color === 'error') {
      console.error(options.message);
    }
  }
}