import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError, switchMap } from 'rxjs';
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
    const clienteData: any = {
      nombre: cliente.nombre,
      contacto: cliente.contacto,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      latitud: cliente.latitud,
      longitud: cliente.longitud,
      tipoCliente: cliente.tipoCliente
    };
    
    // Solo incluir activo si está definido
    if (cliente.activo !== undefined) {
      clienteData.activo = cliente.activo;
    }
    
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
    // Intentar usar endpoint específico de toggle primero
    const toggleUrl = `${this.baseUrl}/clientes/${id}/toggle-status/`;
    console.log('Intentando toggle específico en:', toggleUrl);
    
    return this.http.post<any>(toggleUrl, {}).pipe(
      map(response => {
        console.log('Respuesta del servidor (toggle status):', response);
        if (!response.success || !response.data) {
          throw new Error('Error al cambiar estado del cliente');
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
        console.warn('Endpoint toggle-status no disponible, usando método alternativo:', error);
        
        // Si el endpoint específico falla, usar el método alternativo
        return this.getById(id).pipe(
          switchMap(cliente => {
            const updateData: ClienteUpdateDTO = {
              activo: !cliente.activo
            };
            
            console.log('Usando método alternativo - cambiando estado de', cliente.activo, 'a', !cliente.activo);
            return this.update(id, updateData);
          })
        );
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
    const url = `${this.baseUrl}/clientes/buscar-por-ubicacion/`;
    console.log('Haciendo petición POST a:', url);
    
    const searchData = {
      latitud: lat,
      longitud: lng,
      radio_km: radiusKm
    };
    
    return this.http.post<any>(url, searchData).pipe(
      map(response => {
        console.log('Respuesta del servidor (buscar por ubicación):', response);
        if (!response.success || !response.data) {
          // Si el endpoint no existe, devolver todos los clientes
          console.warn('Endpoint de búsqueda por ubicación no disponible, usando getAll()');
          return [];
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
        console.error('Error searching by location:', error);
        // Fallback: devolver todos los clientes
        return this.getAll();
      })
    );
  }

  // Método para exportar clientes
  exportClientes(formato: 'csv' | 'excel' = 'csv', filters?: ClienteFilter): Observable<Blob> {
    let url = `${this.baseUrl}/clientes/exportar/?formato=${formato}`;
    
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
        url += `&${queryString}`;
      }
    }
    
    console.log('Haciendo petición GET para exportar a:', url);
    
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error exporting clientes:', error);
        return throwError(() => 'Error al exportar clientes');
      })
    );
  }

  // Método para obtener estadísticas de clientes
  getEstadisticas(): Observable<any> {
    const url = `${this.baseUrl}/clientes/estadisticas/`;
    console.log('Haciendo petición GET a:', url);
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Respuesta del servidor (estadísticas):', response);
        if (!response.success || !response.data) {
          throw new Error('Error al obtener estadísticas');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching estadísticas:', error);
        // Devolver estadísticas por defecto
        return throwError(() => 'Error al obtener estadísticas');
      })
    );
  }

  // Método para obtener historial de visitas de un cliente
  getHistorialVisitas(clienteId: number): Observable<any[]> {
    const url = `${this.baseUrl}/clientes/${clienteId}/visitas/`;
    console.log('Haciendo petición GET a:', url);
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Respuesta del servidor (historial visitas):', response);
        if (!response.success || !response.data) {
          return [];
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching historial visitas:', error);
        return throwError(() => 'Error al obtener historial de visitas');
      })
    );
  }

  // Método para validar datos del cliente
  validateCliente(clienteData: ClienteCreateDTO | ClienteUpdateDTO): Observable<any> {
    const url = `${this.baseUrl}/clientes/validar/`;
    console.log('Haciendo petición POST a:', url);
    
    return this.http.post<any>(url, clienteData).pipe(
      map(response => {
        console.log('Respuesta del servidor (validar):', response);
        return response;
      }),
      catchError(error => {
        console.error('Error validating cliente:', error);
        return throwError(() => 'Error al validar datos del cliente');
      })
    );
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

  // Método para duplicar cliente (crear uno nuevo basado en existente)
  duplicateCliente(id: number, nuevoNombre: string): Observable<Cliente> {
    return this.getById(id).pipe(
      switchMap(cliente => {
        const nuevoCliente: ClienteCreateDTO = {
          nombre: nuevoNombre,
          contacto: cliente.contacto,
          telefono: cliente.telefono,
          email: '', // Limpiar email para evitar duplicados
          direccion: cliente.direccion,
          latitud: cliente.latitud,
          longitud: cliente.longitud,
          tipoCliente: cliente.tipoCliente
        };
        // Usar switchMap para aplanar el Observable
        return this.create(nuevoCliente);
      }),
      catchError(error => {
        console.error('Error duplicating cliente:', error);
        return throwError(() => 'Error al duplicar cliente');
      })
    );
  }

  // Método para buscar clientes por proximidad a una dirección
  buscarCercanos(direccion: string, radiusKm: number = 5): Observable<Cliente[]> {
    const url = `${this.baseUrl}/clientes/buscar-cercanos/`;
    console.log('Haciendo petición POST a:', url);
    
    const searchData = {
      direccion: direccion,
      radio_km: radiusKm
    };
    
    return this.http.post<any>(url, searchData).pipe(
      map(response => {
        console.log('Respuesta del servidor (buscar cercanos):', response);
        if (!response.success || !response.data) {
          return [];
        }
        
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
        console.error('Error buscando clientes cercanos:', error);
        return throwError(() => 'Error al buscar clientes cercanos');
      })
    );
  }

  // Método para obtener clientes con visitas pendientes
  getClientesConVisitasPendientes(): Observable<Cliente[]> {
    const url = `${this.baseUrl}/clientes/con-visitas-pendientes/`;
    console.log('Haciendo petición GET a:', url);
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Respuesta del servidor (clientes con visitas pendientes):', response);
        if (!response.success || !response.data) {
          return [];
        }
        
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
        console.error('Error fetching clientes con visitas pendientes:', error);
        return throwError(() => 'Error al obtener clientes con visitas pendientes');
      })
    );
  }
}