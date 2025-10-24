import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject, map, catchError, tap } from 'rxjs';
import { Usuario } from '../interfaces';
import { environment } from '../../../environments/environment';

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

  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Endpoints usando environment
  private baseUrl = environment.apiUrl;
  private loginUrl = `${this.baseUrl}${environment.authEndpoints.login}`;
  private refreshUrl = `${this.baseUrl}${environment.authEndpoints.refresh}`;

  constructor() {
    // Cargar usuario desde localStorage si existe
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        this.currentUserSubject.next(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  /**
   * Llama al backend y normaliza la respuesta.
   * Backend esperado:
   * {
   *  success: true,
   *  data: { access, refresh, user },
   *  message: string
   * }
   */
  public login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      map(resp => {
        if (!resp || !resp.success || !resp.data) {
          throw new Error(resp?.message || 'Respuesta inválida del servidor');
        }

        const access: string | undefined = resp.data.access;
        const refresh: string | undefined = resp.data.refresh;
        const backendUser = resp.data.user;

        if (!access || !backendUser) {
          throw new Error('Faltan tokens o usuario en la respuesta');
        }

        // Mapear usuario backend a la interfaz Usuario del frontend
        const user: Usuario = {
          idUsuario: backendUser.id,
          nombre: backendUser.nombre,
          apellido: backendUser.apellido,
          email: backendUser.email,
          telefono: backendUser.telefono ?? undefined,
          rol: backendUser.rol,
          idSupervisor: backendUser.idSupervisor ?? undefined,
          activo: backendUser.activo ?? true,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
        } as Usuario;

        // Guardar tokens y usuario en localStorage
        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh ?? '');
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);

        const out: AuthResponse = { token: access, user };
        return out;
      }),
      catchError(err => {
        const message = err?.error?.message || err?.message || 'Error en autenticación';
        return throwError(() => message);
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
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

  /** Obtener token actual (access) */
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Obtener refresh token */
  public getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Usar refresh token para obtener nuevo access token
   */
  public refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => 'No refresh token available');
    }

    return this.http.post<any>(this.refreshUrl, { refresh: refreshToken }).pipe(
      map(resp => {
        if (!resp || !resp.success || !resp.data) {
          throw new Error(resp?.message || 'Error al renovar token');
        }

        const access: string | undefined = resp.data.access;
        const newRefresh: string | undefined = resp.data.refresh;

        if (!access) {
          throw new Error('No se recibió nuevo access token');
        }

        // Actualizar tokens en localStorage
        localStorage.setItem('token', access);
        if (newRefresh) {
          localStorage.setItem('refreshToken', newRefresh);
        }

        // Mantener usuario actual
        const currentUser = this.getCurrentUser();
        
        const response: AuthResponse = {
          token: access,
          user: currentUser! // Ya sabemos que existe si llegamos aquí
        };

        return response;
      }),
      catchError(err => {
        const message = err?.error?.message || err?.message || 'Error al renovar token';
        return throwError(() => message);
      })
    );
  }
}