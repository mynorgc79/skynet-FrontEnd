import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@core/services/base-api.service';
import { MockDataService } from '@core/services/mock-data.service';
import { Usuario, UsuarioCreateDTO, UsuarioUpdateDTO, UsuarioFilter, RoleTipo } from '@core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private readonly endpoint = 'usuarios';

  constructor(
    private baseApiService: BaseApiService,
    private mockDataService: MockDataService
  ) { }

  // Métodos que usarán la API cuando esté disponible
  getAll(filters?: UsuarioFilter): Observable<Usuario[]> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.get<Usuario[]>(`${this.endpoint}`, filters);
    return this.mockDataService.getUsuarios(filters);
  }

  getById(id: number): Observable<Usuario> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.get<Usuario>(`${this.endpoint}/${id}`);
    return this.mockDataService.getUsuarioById(id);
  }

  create(usuario: UsuarioCreateDTO): Observable<Usuario> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.post<Usuario>(this.endpoint, usuario);
    return this.mockDataService.createUsuario(usuario);
  }

  update(id: number, usuario: UsuarioUpdateDTO): Observable<Usuario> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.put<Usuario>(`${this.endpoint}/${id}`, usuario);
    return this.mockDataService.updateUsuario(id, usuario);
  }

  delete(id: number): Observable<void> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.delete<void>(`${this.endpoint}/${id}`);
    return this.mockDataService.deleteUsuario(id);
  }

  // Métodos específicos del dominio
  changePassword(id: number, newPassword: string): Observable<void> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.put<void>(`${this.endpoint}/${id}/change-password`, { password: newPassword });
    return this.mockDataService.changeUserPassword(id, newPassword);
  }

  toggleStatus(id: number): Observable<Usuario> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.put<Usuario>(`${this.endpoint}/${id}/toggle-status`, {});
    return this.mockDataService.toggleUserStatus(id);
  }

  getByRole(rol: RoleTipo): Observable<Usuario[]> {
    return this.getAll({ rol });
  }

  getTecnicosBySupervisor(supervisorId: number): Observable<Usuario[]> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.get<Usuario[]>(`${this.endpoint}/supervisor/${supervisorId}/tecnicos`);
    return this.mockDataService.getTecnicosBySupervisor(supervisorId);
  }
}