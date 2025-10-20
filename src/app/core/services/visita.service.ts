import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Visita, CreateVisitaDto, VisitaFilter, Ejecucion, CreateEjecucionDto, ApiResponse, PaginatedResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class VisitaService extends BaseApiService {

  private endpoint = '/visitas';

  // Obtener todas las visitas con filtros y paginación
  getVisitas(page: number = 1, limit: number = 10, filter?: VisitaFilter): Observable<PaginatedResponse<Visita>> {
    const params = {
      page,
      limit,
      ...filter
    };
    return this.getPaginated<Visita>(this.endpoint, params);
  }

  // Obtener visita por ID
  getVisitaById(id: number): Observable<ApiResponse<Visita>> {
    return this.get<Visita>(`${this.endpoint}/${id}`);
  }

  // Crear nueva visita
  createVisita(visita: CreateVisitaDto): Observable<ApiResponse<Visita>> {
    return this.post<Visita>(this.endpoint, visita);
  }

  // Actualizar visita
  updateVisita(id: number, visita: Partial<Visita>): Observable<ApiResponse<Visita>> {
    return this.put<Visita>(`${this.endpoint}/${id}`, visita);
  }

  // Eliminar visita
  deleteVisita(id: number): Observable<ApiResponse<any>> {
    return this.delete(`${this.endpoint}/${id}`);
  }

  // Obtener visitas de hoy
  getVisitasHoy(): Observable<ApiResponse<Visita[]>> {
    return this.get<Visita[]>(`${this.endpoint}/hoy`);
  }

  // Obtener visitas por técnico
  getVisitasByTecnico(tecnicoId: number, fecha?: Date): Observable<ApiResponse<Visita[]>> {
    const params = fecha ? { fecha: fecha.toISOString().split('T')[0] } : {};
    return this.get<Visita[]>(`${this.endpoint}/tecnico/${tecnicoId}`, params);
  }

  // Obtener visitas por supervisor (su equipo)
  getVisitasBySupervisor(supervisorId: number, fecha?: Date): Observable<ApiResponse<Visita[]>> {
    const params = fecha ? { fecha: fecha.toISOString().split('T')[0] } : {};
    return this.get<Visita[]>(`${this.endpoint}/supervisor/${supervisorId}`, params);
  }

  // Obtener visitas por cliente
  getVisitasByCliente(clienteId: number): Observable<ApiResponse<Visita[]>> {
    return this.get<Visita[]>(`${this.endpoint}/cliente/${clienteId}`);
  }

  // Iniciar visita (cambiar estado a EN_PROGRESO)
  iniciarVisita(visitaId: number, ejecucion: CreateEjecucionDto): Observable<ApiResponse<Visita>> {
    return this.post<Visita>(`${this.endpoint}/${visitaId}/iniciar`, ejecucion);
  }

  // Finalizar visita (cambiar estado a COMPLETADA)
  finalizarVisita(visitaId: number, ejecucion: CreateEjecucionDto): Observable<ApiResponse<Visita>> {
    return this.post<Visita>(`${this.endpoint}/${visitaId}/finalizar`, ejecucion);
  }

  // Cancelar visita
  cancelarVisita(visitaId: number, motivo: string): Observable<ApiResponse<Visita>> {
    return this.patch<Visita>(`${this.endpoint}/${visitaId}/cancelar`, { motivo });
  }

  // Reprogramar visita
  reprogramarVisita(visitaId: number, nuevaFecha: Date): Observable<ApiResponse<Visita>> {
    return this.patch<Visita>(`${this.endpoint}/${visitaId}/reprogramar`, { 
      fechaVisita: nuevaFecha.toISOString() 
    });
  }

  // Obtener ejecuciones de una visita
  getEjecuciones(visitaId: number): Observable<ApiResponse<Ejecucion[]>> {
    return this.get<Ejecucion[]>(`${this.endpoint}/${visitaId}/ejecuciones`);
  }

  // Generar reporte de visita
  generarReporte(visitaId: number): Observable<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${visitaId}/generar-reporte`, {});
  }

  // Enviar reporte por email
  enviarReporte(visitaId: number, email?: string): Observable<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${visitaId}/enviar-reporte`, { email });
  }

  // Obtener estadísticas de visitas
  getEstadisticas(fechaInicio?: Date, fechaFin?: Date): Observable<ApiResponse<any>> {
    const params: any = {};
    if (fechaInicio) params.fechaInicio = fechaInicio.toISOString().split('T')[0];
    if (fechaFin) params.fechaFin = fechaFin.toISOString().split('T')[0];
    
    return this.get<any>(`${this.endpoint}/estadisticas`, params);
  }

  // Obtener ruta optimizada para las visitas del día
  getRutaOptimizada(tecnicoId: number, fecha: Date): Observable<ApiResponse<any>> {
    return this.get<any>(`${this.endpoint}/ruta-optimizada`, {
      tecnicoId,
      fecha: fecha.toISOString().split('T')[0]
    });
  }
}