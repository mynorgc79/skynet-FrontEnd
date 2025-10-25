import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from '@core/services/base-api.service';
import { Visita, VisitaCreateDTO, VisitaUpdateDTO, VisitaFilter, EstadoVisita, ApiResponse } from '@core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VisitasService extends BaseApiService {

  private readonly endpoint = '/visitas';

  // CRUD básico
  getAll(filters?: VisitaFilter): Observable<Visita[]> {
    return this.get<Visita[]>(`${this.endpoint}/`, filters).pipe(
      map((response: ApiResponse<Visita[]>) => response.data || [])
    );
  }

  getById(id: number): Observable<Visita> {
    return this.get<Visita>(`${this.endpoint}/${id}/`).pipe(
      map((response: ApiResponse<Visita>) => response.data)
    );
  }

  create(visita: VisitaCreateDTO): Observable<Visita> {
    return this.post<Visita>(`${this.endpoint}/create/`, visita).pipe(
      map((response: ApiResponse<Visita>) => response.data)
    );
  }

  update(id: number, visita: VisitaUpdateDTO): Observable<Visita> {
    return this.put<Visita>(`${this.endpoint}/${id}/update/`, visita).pipe(
      map((response: ApiResponse<Visita>) => response.data)
    );
  }

  deleteVisita(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}/delete/`).pipe(
      map(() => void 0)
    );
  }

  // Gestión de estados
  iniciar(id: number): Observable<Visita> {
    return this.post<Visita>(`${this.endpoint}/${id}/iniciar/`, {}).pipe(
      map((response: ApiResponse<Visita>) => response.data)
    );
  }

  completar(id: number, observaciones?: string): Observable<Visita> {
    const data = observaciones ? { observaciones } : {};
    return this.post<Visita>(`${this.endpoint}/${id}/completar/`, data).pipe(
      map((response: ApiResponse<Visita>) => response.data)
    );
  }

  cancelar(id: number, motivo?: string): Observable<Visita> {
    const data = motivo ? { motivo } : {};
    return this.post<Visita>(`${this.endpoint}/${id}/cancelar/`, data).pipe(
      map((response: ApiResponse<Visita>) => response.data)
    );
  }

  // Reprogramación
  reprogramar(id: number, nuevaFecha: string, horaInicio?: string): Observable<Visita> {
    const data: any = { nueva_fecha: nuevaFecha };
    if (horaInicio) {
      data.hora_inicio = horaInicio;
    }
    return this.post<Visita>(`${this.endpoint}/${id}/reprogramar/`, data).pipe(
      map((response: ApiResponse<Visita>) => response.data)
    );
  }

  // Gestión de ejecuciones
  getEjecuciones(visitaId: number): Observable<any[]> {
    return this.get<any[]>(`${this.endpoint}/${visitaId}/ejecuciones/`).pipe(
      map((response: ApiResponse<any[]>) => response.data || [])
    );
  }

  createEjecucion(visitaId: number, ejecucionData: any): Observable<any> {
    return this.post<any>(`${this.endpoint}/${visitaId}/ejecuciones/create/`, ejecucionData).pipe(
      map((response: ApiResponse<any>) => response.data)
    );
  }

  updateEjecucion(visitaId: number, ejecucionId: number, ejecucionData: any): Observable<any> {
    return this.put<any>(`${this.endpoint}/${visitaId}/ejecuciones/${ejecucionId}/update/`, ejecucionData).pipe(
      map((response: ApiResponse<any>) => response.data)
    );
  }

  deleteEjecucion(visitaId: number, ejecucionId: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${visitaId}/ejecuciones/${ejecucionId}/delete/`).pipe(
      map(() => void 0)
    );
  }

  // Consultas específicas con filtros del backend
  getByTecnico(tecnicoId: number): Observable<Visita[]> {
    return this.getAll({ tecnicoId });
  }

  getBySupervisor(supervisorId: number): Observable<Visita[]> {
    return this.getAll({ supervisorId });
  }

  getByCliente(clienteId: number): Observable<Visita[]> {
    return this.getAll({ clienteId });
  }

  getHoy(): Observable<Visita[]> {
    const today = new Date();
    return this.getAll({ fechaDesde: today, fechaHasta: today });
  }

  getByEstado(estado: EstadoVisita): Observable<Visita[]> {
    return this.getAll({ estado });
  }

  // Métodos de utilidad
  getPrioridadColor(prioridad: string): string {
    const colors = {
      'URGENTE': 'danger',
      'ALTA': 'warning',
      'MEDIA': 'info',
      'BAJA': 'secondary'
    };
    return colors[prioridad as keyof typeof colors] || 'secondary';
  }

  getEstadoColor(estado: EstadoVisita): string {
    const colors = {
      'PROGRAMADA': 'primary',
      'EN_PROGRESO': 'warning',
      'COMPLETADA': 'success',
      'CANCELADA': 'danger'
    };
    return colors[estado] || 'secondary';
  }

  getEstadoLabel(estado: EstadoVisita): string {
    const labels = {
      'PROGRAMADA': 'Programada',
      'EN_PROGRESO': 'En Progreso',
      'COMPLETADA': 'Completada',
      'CANCELADA': 'Cancelada'
    };
    return labels[estado] || estado;
  }

  getTipoVisitaLabel(tipo: string): string {
    const labels = {
      'MANTENIMIENTO': 'Mantenimiento',
      'INSTALACION': 'Instalación',
      'SOPORTE': 'Soporte',
      'INSPECCION': 'Inspección',
      'REPARACION': 'Reparación'
    };
    return labels[tipo as keyof typeof labels] || tipo;
  }

  // Validaciones
  canIniciar(visita: Visita): boolean {
    return visita.estado === EstadoVisita.PROGRAMADA;
  }

  canCompletar(visita: Visita): boolean {
    return visita.estado === EstadoVisita.EN_PROGRESO;
  }

  canCancelar(visita: Visita): boolean {
    return visita.estado !== EstadoVisita.COMPLETADA;
  }

  canEdit(visita: Visita): boolean {
    return visita.estado === EstadoVisita.PROGRAMADA;
  }

  canReprogramar(visita: Visita): boolean {
    return visita.estado === EstadoVisita.PROGRAMADA || visita.estado === EstadoVisita.CANCELADA;
  }

  // Formateo
  formatTime(time?: string | Date): string {
    if (!time) return '';
    if (time instanceof Date) {
      return time.toTimeString().substring(0,5);
    }
    return String(time).substring(0,5); // HH:MM
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  // Formateo de fechas específico para el backend
  formatDateForApi(date: Date | string): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    return date;
  }

  formatTimeForApi(time: Date | string): string {
    if (time instanceof Date) {
      return time.toTimeString().substring(0,8); // HH:MM:SS
    }
    return time;
  }

  formatDateTimeForApi(dateTime: Date): string {
    return dateTime.toISOString(); // Formato completo ISO
  }
}