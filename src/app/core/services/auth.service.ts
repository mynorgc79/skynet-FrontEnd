import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, delay, BehaviorSubject, switchMap } from 'rxjs';
import { Usuario } from '../interfaces';
import { MockDataService } from './mock-data.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private mockDataService = inject(MockDataService);
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Cargar usuario desde localStorage si existe
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  public login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Usar MockDataService para obtener usuarios reales
    return this.mockDataService.getUsuarios().pipe(
      switchMap(usuarios => {
        // Buscar usuario por email
        const user = usuarios.find(u => u.email === credentials.email && u.activo);
        
        if (!user) {
          return throwError(() => 'Usuario no encontrado o inactivo');
        }
        
        // En un entorno real, aquí verificarías la contraseña encriptada
        // Para el mock, aceptamos '123456' para todos los usuarios
        if (credentials.password !== '123456') {
          return throwError(() => 'Contraseña incorrecta');
        }
        
        const response: AuthResponse = {
          token: `fake-jwt-token-${user.idUsuario}`,
          user
        };
        
        // Guardar datos del usuario
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        return of(response);
      }),
      delay(1000) // Simular demora de red
    );
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('token') && !!this.getCurrentUser();
  }

  public getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  public getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.rol || null;
  }

  public hasRole(role: string): boolean {
    const userRole = this.getCurrentUserRole();
    return userRole === role;
  }

  public hasAnyRole(roles: string[]): boolean {
    const userRole = this.getCurrentUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  public isAdmin(): boolean {
    return this.hasRole('ADMINISTRADOR');
  }

  public isSupervisor(): boolean {
    return this.hasRole('SUPERVISOR');
  }

  public isTecnico(): boolean {
    return this.hasRole('TECNICO');
  }
}