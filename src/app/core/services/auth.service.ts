import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Simulación temporal - reemplaza con tu lógica real
    if (credentials.email === 'admin@test.com' && credentials.password === '123456') {
      return of({
        token: 'fake-jwt-token',
        user: {
          id: '1',
          email: credentials.email,
          name: 'Usuario Test'
        }
      }).pipe(delay(1000)); // Simula delay de red
    } else {
      return throwError(() => 'Credenciales inválidas').pipe(delay(1000));
    }
  }

  public logout(): void {
    // Implementar lógica de logout
    localStorage.removeItem('token');
  }

  public isAuthenticated(): boolean {
    // Implementar verificación de autenticación
    return !!localStorage.getItem('token');
  }
}