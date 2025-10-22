import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { MockDataService } from './mock-data.service';
import { Usuario, CreateUsuarioDto, UsuarioFilter, ApiResponse, PaginatedResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseApiService {

  private endpoint = '/usuarios';
  private mockDataService = new MockDataService();

  // Obtener todos los usuarios con filtros y paginación
  getUsuarios(page: number = 1, limit: number = 10, filter?: UsuarioFilter): Observable<PaginatedResponse<Usuario>> {
    const params = {
      page,
      limit,
      ...filter
    };
    return this.getPaginated<Usuario>(this.endpoint, params);
  }

  // Obtener usuario por ID
  getUsuarioById(id: number): Observable<ApiResponse<Usuario>> {
    return this.get<Usuario>(`${this.endpoint}/${id}`);
  }

  // Crear nuevo usuario
  createUsuario(usuario: CreateUsuarioDto): Observable<ApiResponse<Usuario>> {
    return this.post<Usuario>(this.endpoint, usuario);
  }

  // Actualizar usuario
  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<ApiResponse<Usuario>> {
    return this.put<Usuario>(`${this.endpoint}/${id}`, usuario);
  }

  // Eliminar usuario
  deleteUsuario(id: number): Observable<ApiResponse<any>> {
    return this.delete(`${this.endpoint}/${id}`);
  }

  // Cambiar estado del usuario (activar/desactivar)
  toggleUsuarioEstado(id: number): Observable<ApiResponse<Usuario>> {
    return this.patch<Usuario>(`${this.endpoint}/${id}/toggle-estado`, {});
  }

  // Obtener usuarios por rol
  getUsuariosByRol(rolId: number): Observable<ApiResponse<Usuario[]>> {
    return this.get<Usuario[]>(`${this.endpoint}/by-rol/${rolId}`);
  }

  // Obtener supervisores
  getSupervisores(): Observable<ApiResponse<Usuario[]>> {
    return this.get<Usuario[]>(`${this.endpoint}/supervisores`);
  }

  // Obtener técnicos
  getTecnicos(): Observable<ApiResponse<Usuario[]>> {
    return this.get<Usuario[]>(`${this.endpoint}/tecnicos`);
  }

  // Obtener técnicos asignados a un supervisor
  getTecnicosBySupervisor(supervisorId: number): Observable<ApiResponse<Usuario[]>> {
    return this.get<Usuario[]>(`${this.endpoint}/tecnicos/supervisor/${supervisorId}`);
  }

  // Cambiar contraseña
  changePassword(id: number, newPassword: string): Observable<ApiResponse<any>> {
    return this.patch<any>(`${this.endpoint}/${id}/change-password`, { password: newPassword });
  }

  // Métodos temporales con mock data para desarrollo
  getByRol(rol: string): Observable<Usuario[]> {
    return this.mockDataService.getUsuarios().pipe(
      map((usuarios: Usuario[]) => usuarios.filter((usuario: Usuario) => usuario.rol === rol))
    );
  }
}