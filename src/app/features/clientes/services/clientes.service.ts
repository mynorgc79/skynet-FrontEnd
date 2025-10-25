import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Cliente, ClienteCreateDTO, ClienteUpdateDTO, ClienteFilter } from '@core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api'; // URL del backend

  // Métodos que usan la API real
  getAll(filters?: ClienteFilter): Observable<Cliente[]> {
    let url = `${this.baseUrl}/clientes/`;
    
    // Agregar filtros como query parameters si se proporcionan
    if (filters) {
      const params = new URLSearchParams();
      if (filters.nombre) params.append('nombre', filters.nombre);
      if (filters.contacto) params.append('contacto', filters.contacto);
      if (filters.email) params.append('email', filters.email);
      if (filters.tipoCliente) params.append('tipoCliente', filters.tipoCliente);
      if (filters.activo !== undefined) params.append('activo', filters.activo.toString());
      if (filters.departamento) params.append('departamento', filters.departamento);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    console.log('Haciendo petición GET a:', url);
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Respuesta del servidor (lista clientes):', response);
        if (!response.success || !response.data) {
          throw new Error('Error al obtener clientes');
        }
        
        // Mapear del formato backend al formato frontend
        return response.data.map((backendCliente: any) => ({
          idCliente: backendCliente.idCliente,
          nombre: backendCliente.nombre,
          contacto: backendCliente.contacto,
          telefono: backendCliente.telefono,
          email: backendCliente.email,
          direccion: backendCliente.direccion,
          latitud: parseFloat(backendCliente.latitud),
          longitud: parseFloat(backendCliente.longitud),
          tipoCliente: backendCliente.tipoCliente,
          activo: backendCliente.activo,
          fechaCreacion: new Date(backendCliente.fechaCreacion),
          fechaActualizacion: new Date(backendCliente.fechaActualizacion),
        } as Cliente));
      }),
      catchError(error => {
        console.error('Error fetching clientes:', error);
        return throwError(() => 'Error al obtener clientes');
      })
    );
  }

  getById(id: number): Observable<Cliente> {
    const url = `${this.baseUrl}/clientes/${id}/`;
    console.log('Haciendo petición GET a:', url);
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Respuesta del servidor (detalle cliente):', response);
        if (!response.success || !response.data) {
          throw new Error('Cliente no encontrado');
        }
        
        // Mapear del formato backend al formato frontend
        const backendCliente = response.data;
        return {
          idCliente: backendCliente.idCliente,
          nombre: backendCliente.nombre,
          contacto: backendCliente.contacto,
          telefono: backendCliente.telefono,
          email: backendCliente.email,
          direccion: backendCliente.direccion,
          latitud: parseFloat(backendCliente.latitud),
          longitud: parseFloat(backendCliente.longitud),
          tipoCliente: backendCliente.tipoCliente,
          activo: backendCliente.activo,
          fechaCreacion: new Date(backendCliente.fechaCreacion),
          fechaActualizacion: new Date(backendCliente.fechaActualizacion),
        } as Cliente;
      }),
      catchError(error => {
        console.error('Error fetching cliente by id:', error);
        return throwError(() => 'Error al obtener cliente');
      })
    );
  }

  create(cliente: ClienteCreateDTO): Observable<Cliente> {
    const url = `${this.baseUrl}/clientes/create/`;
    
    // Preparar datos en el formato que espera el backend
    const clienteData = {
      nombre: cliente.nombre,
      contacto: cliente.contacto,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      latitud: cliente.latitud,
      longitud: cliente.longitud,
      tipoCliente: cliente.tipoCliente
    };
    
    console.log('Haciendo petición POST a:', url, 'con datos:', clienteData);
    
    return this.http.post<any>(url, clienteData).pipe(
      map(response => {
        console.log('Respuesta del servidor (crear cliente):', response);
        if (!response.success || !response.data) {
          throw new Error('Error al crear cliente');
        }
        
        // Mapear del formato backend al formato frontend
        const backendCliente = response.data;
        return {
          idCliente: backendCliente.idCliente,
          nombre: backendCliente.nombre,
          contacto: backendCliente.contacto,
          telefono: backendCliente.telefono,
          email: backendCliente.email,
          direccion: backendCliente.direccion,
          latitud: parseFloat(backendCliente.latitud),
          longitud: parseFloat(backendCliente.longitud),
          tipoCliente: backendCliente.tipoCliente,
          activo: backendCliente.activo,
          fechaCreacion: new Date(backendCliente.fechaCreacion),
          fechaActualizacion: new Date(backendCliente.fechaActualizacion),
        } as Cliente;
      }),
      catchError(error => {
        console.error('Error creating cliente:', error);
        return throwError(() => 'Error al crear cliente');
      })
    );
  }

  update(id: number, cliente: ClienteUpdateDTO): Observable<Cliente> {
    const url = `${this.baseUrl}/clientes/${id}/update/`;
    
    // Preparar datos en el formato que espera el backend
    const clienteData = {
      nombre: cliente.nombre,
      contacto: cliente.contacto,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      latitud: cliente.latitud,
      longitud: cliente.longitud,
      tipoCliente: cliente.tipoCliente
    };
    
    console.log('Haciendo petición PUT a:', url, 'con datos:', clienteData);
    
    return this.http.put<any>(url, clienteData).pipe(
      map(response => {
        console.log('Respuesta del servidor (actualizar cliente):', response);
        if (!response.success || !response.data) {
          throw new Error('Error al actualizar cliente');
        }
        
        // Mapear del formato backend al formato frontend
        const backendCliente = response.data;
        return {
          idCliente: backendCliente.idCliente,
          nombre: backendCliente.nombre,
          contacto: backendCliente.contacto,
          telefono: backendCliente.telefono,
          email: backendCliente.email,
          direccion: backendCliente.direccion,
          latitud: parseFloat(backendCliente.latitud),
          longitud: parseFloat(backendCliente.longitud),
          tipoCliente: backendCliente.tipoCliente,
          activo: backendCliente.activo,
          fechaCreacion: new Date(backendCliente.fechaCreacion),
          fechaActualizacion: new Date(backendCliente.fechaActualizacion),
        } as Cliente;
      }),
      catchError(error => {
        console.error('Error updating cliente:', error);
        return throwError(() => 'Error al actualizar cliente');
      })
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.baseUrl}/clientes/${id}/delete/`;
    console.log('Haciendo petición DELETE a:', url);
    
    return this.http.delete<any>(url).pipe(
      map(response => {
        console.log('Respuesta del servidor (eliminar cliente):', response);
        if (!response.success) {
          throw new Error('Error al eliminar cliente');
        }
        return void 0;
      }),
      catchError(error => {
        console.error('Error deleting cliente:', error);
        return throwError(() => 'Error al eliminar cliente');
      })
    );
  }

  toggleStatus(id: number): Observable<Cliente> {
    // TODO: Implementar endpoint toggle-status en el backend
    // Por ahora simular toggle cambiando el estado local
    return this.getById(id).pipe(
      map(cliente => {
        cliente.activo = !cliente.activo;
        return cliente;
      })
    );
  }

  // Métodos específicos del dominio
  getByDepartamento(departamento: string): Observable<Cliente[]> {
    return this.getAll({ departamento });
  }

  getActivos(): Observable<Cliente[]> {
    return this.getAll({ activo: true });
  }

  searchByLocation(lat: number, lng: number, radiusKm: number = 10): Observable<Cliente[]> {
    // TODO: Implementar búsqueda por ubicación en el backend
    // Por ahora retornamos todos los clientes
    return this.getAll();
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
    return cliente.direccion || '';
  }
}