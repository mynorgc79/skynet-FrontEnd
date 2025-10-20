import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@core/services/base-api.service';
import { MockDataService } from '@core/services/mock-data.service';
import { Cliente, ClienteCreateDTO, ClienteUpdateDTO, ClienteFilter } from '@core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private readonly endpoint = 'clientes';

  constructor(
    private baseApiService: BaseApiService,
    private mockDataService: MockDataService
  ) { }

  // Métodos que usarán la API cuando esté disponible
  getAll(filters?: ClienteFilter): Observable<Cliente[]> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.get<Cliente[]>(`${this.endpoint}`, filters);
    return this.mockDataService.getClientesData(filters);
  }

  getById(id: number): Observable<Cliente> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.get<Cliente>(`${this.endpoint}/${id}`);
    return this.mockDataService.getClienteById(id);
  }

  create(cliente: ClienteCreateDTO): Observable<Cliente> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.post<Cliente>(this.endpoint, cliente);
    return this.mockDataService.createCliente(cliente);
  }

  update(id: number, cliente: ClienteUpdateDTO): Observable<Cliente> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.put<Cliente>(`${this.endpoint}/${id}`, cliente);
    return this.mockDataService.updateCliente(id, cliente);
  }

  delete(id: number): Observable<void> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.delete<void>(`${this.endpoint}/${id}`);
    return this.mockDataService.deleteCliente(id);
  }

  toggleStatus(id: number): Observable<Cliente> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.put<Cliente>(`${this.endpoint}/${id}/toggle-status`, {});
    return this.mockDataService.toggleClienteStatus(id);
  }

  // Métodos específicos del dominio
  getByDepartamento(departamento: string): Observable<Cliente[]> {
    return this.mockDataService.getClientesByDepartamento(departamento);
  }

  getActivos(): Observable<Cliente[]> {
    return this.mockDataService.getClientesActivos();
  }

  searchByLocation(lat: number, lng: number, radiusKm: number = 10): Observable<Cliente[]> {
    return this.mockDataService.searchClientesByLocation(lat, lng, radiusKm);
  }

  // Métodos para Google Maps
  getGoogleMapsUrl(cliente: Cliente): string {
    return `https://www.google.com/maps?q=${cliente.latitud},${cliente.longitud}`;
  }

  getDirectionsUrl(from: {lat: number, lng: number}, to: Cliente): string {
    return `https://www.google.com/maps/dir/${from.lat},${from.lng}/${to.latitud},${to.longitud}`;
  }

  // Validar coordenadas
  validateCoordinates(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  // Formatear dirección completa
  getFullAddress(cliente: Cliente): string {
    const parts = [
      cliente.direccion,
      cliente.ciudad,
      cliente.departamento
    ].filter(part => part && part.trim());
    
    if (cliente.codigoPostal) {
      parts.push(cliente.codigoPostal);
    }
    
    return parts.join(', ');
  }
}