import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { Usuario, UsuarioCreateDTO, UsuarioUpdateDTO, UsuarioFilter, RoleTipo } from '@core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'http://localhost:8000/api'; // URL del backend

  // Métodos que usan la API real
  getAll(filters?: UsuarioFilter): Observable<Usuario[]> {
    // Usar AuthService que ya tiene implementado getUsuarios() con el endpoint correcto
    return this.authService.getUsuarios().pipe(
      map(usuarios => {
        // Aplicar filtros localmente si se proporcionan
        if (!filters) return usuarios;
        
        return usuarios.filter(usuario => {
          if (filters.nombre && !usuario.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) && 
              !usuario.apellido.toLowerCase().includes(filters.nombre.toLowerCase())) {
            return false;
          }
          if (filters.email && !usuario.email.toLowerCase().includes(filters.email.toLowerCase())) {
            return false;
          }
          if (filters.rol && usuario.rol !== filters.rol) {
            return false;
          }
          if (filters.activo !== undefined && usuario.activo !== filters.activo) {
            return false;
          }
          return true;
        });
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => 'Error al obtener usuarios');
      })
    );
  }

  getById(id: number): Observable<Usuario> {
    const url = `${this.baseUrl}/usuarios/usuarios/${id}/`;
    console.log('Haciendo petición GET a:', url);
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Respuesta del servidor:', response);
        if (!response.success || !response.data) {
          throw new Error('Usuario no encontrado');
        }
        
        // Mapear del formato backend al formato frontend
        const backendUser = response.data;
        return {
          idUsuario: backendUser.id,
          nombre: backendUser.nombre,
          apellido: backendUser.apellido,
          email: backendUser.email,
          telefono: backendUser.telefono,
          rol: backendUser.rol as RoleTipo,
          activo: backendUser.activo,
          fechaCreacion: new Date(backendUser.fecha_creacion),
          fechaActualizacion: new Date(backendUser.fecha_actualizacion),
        } as Usuario;
      }),
      catchError(error => {
        console.error('Error fetching user by id:', error);
        return throwError(() => 'Error al obtener usuario');
      })
    );
  }

  create(usuario: UsuarioCreateDTO): Observable<Usuario> {
    // Usar el endpoint específico para crear usuarios
    const temporalPassword = 'temporal123'; // En un caso real, se podría generar una contraseña temporal
    const userData = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono || '',
      rol: usuario.rol,
      password: temporalPassword,
      confirm_password: temporalPassword // Campo requerido por el backend
    };
    
    return this.http.post<any>(`${this.baseUrl}/usuarios/usuarios/create/`, userData).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error('Error al crear usuario');
        }
        
        // Mapear del formato backend al formato frontend
        const backendUser = response.data;
        return {
          idUsuario: backendUser.id,
          nombre: backendUser.nombre,
          apellido: backendUser.apellido,
          email: backendUser.email,
          telefono: backendUser.telefono,
          rol: backendUser.rol as RoleTipo,
          activo: backendUser.activo,
          fechaCreacion: new Date(backendUser.fecha_creacion),
          fechaActualizacion: new Date(backendUser.fecha_actualizacion),
        } as Usuario;
      }),
      catchError(error => {
        console.error('Error creating user:', error);
        return throwError(() => 'Error al crear usuario');
      })
    );
  }

  update(id: number, usuario: UsuarioUpdateDTO): Observable<Usuario> {
    // Usar el endpoint específico para actualizar usuarios
    const userData = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono || '',
      rol: usuario.rol
    };
    
    const url = `${this.baseUrl}/usuarios/usuarios/${id}/update/`;
    console.log('Haciendo petición PUT a:', url, 'con datos:', userData);
    
    return this.http.put<any>(url, userData).pipe(
      map(response => {
        console.log('Respuesta del servidor (update):', response);
        if (!response.success || !response.data) {
          throw new Error('Error al actualizar usuario');
        }
        
        // Mapear del formato backend al formato frontend
        const backendUser = response.data;
        return {
          idUsuario: backendUser.id,
          nombre: backendUser.nombre,
          apellido: backendUser.apellido,
          email: backendUser.email,
          telefono: backendUser.telefono,
          rol: backendUser.rol as RoleTipo,
          activo: backendUser.activo,
          fechaCreacion: new Date(backendUser.fecha_creacion),
          fechaActualizacion: new Date(backendUser.fecha_actualizacion),
        } as Usuario;
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => 'Error al actualizar usuario');
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/usuarios/usuarios/${id}/`).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => 'Error al eliminar usuario');
      })
    );
  }

  // Métodos específicos del dominio
  changePassword(id: number, newPassword: string): Observable<void> {
    return this.http.put<any>(`${this.baseUrl}/usuarios/usuarios/${id}/change-password/`, { password: newPassword }).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Error changing password:', error);
        return throwError(() => 'Error al cambiar contraseña');
      })
    );
  }

  toggleStatus(id: number): Observable<Usuario> {
    // Usar POST para activar/desactivar usuario
    const url = `${this.baseUrl}/usuarios/usuarios/${id}/toggle-status/`;
    console.log('Haciendo petición POST a:', url);
    
    return this.http.post<any>(url, {}).pipe(
      map(response => {
        console.log('Respuesta del servidor (toggle):', response);
        if (!response.success || !response.data) {
          throw new Error('Error al cambiar estado del usuario');
        }
        
        // Mapear del formato backend al formato frontend
        const backendUser = response.data;
        return {
          idUsuario: backendUser.id,
          nombre: backendUser.nombre,
          apellido: backendUser.apellido,
          email: backendUser.email,
          telefono: backendUser.telefono,
          rol: backendUser.rol as RoleTipo,
          activo: backendUser.activo,
          fechaCreacion: new Date(backendUser.fecha_creacion),
          fechaActualizacion: new Date(backendUser.fecha_actualizacion),
        } as Usuario;
      }),
      catchError(error => {
        console.error('Error toggling user status:', error);
        return throwError(() => 'Error al cambiar estado del usuario');
      })
    );
  }

  getByRole(rol: RoleTipo): Observable<Usuario[]> {
    return this.getAll({ rol });
  }

  getTecnicosBySupervisor(supervisorId: number): Observable<Usuario[]> {
    return this.getAll().pipe(
      map(usuarios => usuarios.filter(u => u.idSupervisor === supervisorId && u.rol === RoleTipo.TECNICO))
    );
  }
}