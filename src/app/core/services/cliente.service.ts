import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Cliente, ClienteCreateDTO, ClienteFilter, ApiResponse, PaginatedResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseApiService {

  private endpoint = '/clientes';

  // Obtener todos los clientes con filtros y paginación
  getClientes(page: number = 1, limit: number = 10, filter?: ClienteFilter): Observable<PaginatedResponse<Cliente>> {
    const params = {
      page,
      limit,
      ...filter
    };
    return this.getPaginated<Cliente>(this.endpoint, params);
  }

  // Obtener cliente por ID
  getClienteById(id: number): Observable<ApiResponse<Cliente>> {
    return this.get<Cliente>(`${this.endpoint}/${id}`);
  }

  // Crear nuevo cliente
  createCliente(cliente: ClienteCreateDTO): Observable<ApiResponse<Cliente>> {
    return this.post<Cliente>(this.endpoint, cliente);
  }

  // Actualizar cliente
  updateCliente(id: number, cliente: Partial<Cliente>): Observable<ApiResponse<Cliente>> {
    return this.put<Cliente>(`${this.endpoint}/${id}`, cliente);
  }

  // Eliminar cliente
  deleteCliente(id: number): Observable<ApiResponse<any>> {
    return this.delete(`${this.endpoint}/${id}`);
  }

  // Buscar clientes por nombre o email
  searchClientes(query: string): Observable<ApiResponse<Cliente[]>> {
    return this.get<Cliente[]>(`${this.endpoint}/search`, { q: query });
  }

  // Obtener clientes cercanos a una ubicación
  getClientesCercanos(latitud: number, longitud: number, radio: number = 10): Observable<ApiResponse<Cliente[]>> {
    return this.get<Cliente[]>(`${this.endpoint}/cercanos`, { 
      latitud, 
      longitud, 
      radio 
    });
  }

  // Validar coordenadas del cliente
  validateCoordenadas(latitud: number, longitud: number): Observable<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/validate-coordinates`, { 
      latitud, 
      longitud 
    });
  }

  // Obtener información de ubicación por coordenadas (Google Maps)
  getLocationInfo(latitud: number, longitud: number): Observable<ApiResponse<any>> {
    return this.get<any>(`${this.endpoint}/location-info`, { 
      latitud, 
      longitud 
    });
  }
}