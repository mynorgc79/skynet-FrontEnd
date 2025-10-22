import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@core/services/base-api.service';
import { MockDataService } from '@core/services/mock-data.service';
import { Visita, VisitaCreateDTO, VisitaUpdateDTO, VisitaFilter, EstadoVisita } from '@core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VisitasService {

  private readonly endpoint = 'visitas';

  constructor(
    private baseApiService: BaseApiService,
    private mockDataService: MockDataService
  ) { }

  // Métodos que usarán la API cuando esté disponible
  getAll(filters?: VisitaFilter): Observable<Visita[]> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.get<Visita[]>(`${this.endpoint}`, filters);
    return this.mockDataService.getVisitasData(filters);
  }

  getById(id: number): Observable<Visita> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.get<Visita>(`${this.endpoint}/${id}`);
    return this.mockDataService.getVisitaById(id);
  }

  create(visita: VisitaCreateDTO): Observable<Visita> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.post<Visita>(this.endpoint, visita);
    return this.mockDataService.createVisita(visita);
  }

  update(id: number, visita: VisitaUpdateDTO): Observable<Visita> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.put<Visita>(`${this.endpoint}/${id}`, visita);
    return this.mockDataService.updateVisita(id, visita);
  }

  delete(id: number): Observable<void> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.delete<void>(`${this.endpoint}/${id}`);
    return this.mockDataService.deleteVisita(id);
  }

  // Métodos específicos del dominio
  iniciar(id: number): Observable<Visita> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.put<Visita>(`${this.endpoint}/${id}/iniciar`, {});
    return this.mockDataService.iniciarVisita(id);
  }

  completar(id: number, observaciones?: string): Observable<Visita> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.put<Visita>(`${this.endpoint}/${id}/completar`, { observaciones });
    return this.mockDataService.completarVisita(id, observaciones);
  }

  cancelar(id: number, motivo?: string): Observable<Visita> {
    // TODO: Reemplazar con llamada real a la API
    // return this.baseApiService.put<Visita>(`${this.endpoint}/${id}/cancelar`, { motivo });
    return this.mockDataService.cancelarVisita(id, motivo);
  }

  // Consultas específicas
  getByTecnico(tecnicoId: number): Observable<Visita[]> {
    return this.mockDataService.getVisitasByTecnico(tecnicoId);
  }

  getBySupervisor(supervisorId: number): Observable<Visita[]> {
    return this.mockDataService.getVisitasBySupervisor(supervisorId);
  }

  getByCliente(clienteId: number): Observable<Visita[]> {
    return this.mockDataService.getVisitasByCliente(clienteId);
  }

  getHoy(): Observable<Visita[]> {
    return this.mockDataService.getVisitasHoy();
  }

  getByEstado(estado: EstadoVisita): Observable<Visita[]> {
    return this.mockDataService.getVisitasPorEstado(estado);
  }

  getEstadisticas(): Observable<any> {
    return this.mockDataService.getEstadisticasVisitas();
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

  getPrioridadLabel(prioridad: string): string {
    const labels = {
      'URGENTE': 'Urgente',
      'ALTA': 'Alta',
      'MEDIA': 'Media',
      'BAJA': 'Baja'
    };
    return labels[prioridad as keyof typeof labels] || prioridad;
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

  getTimeRange(visita: Visita): string {
    const inicio = this.formatTime(visita.horaInicio);
    const fin = this.formatTime(visita.horaFin);
    if (fin) {
      return `${inicio} - ${fin}`;
    }
    return `${inicio} (${this.formatDuration(visita.duracionEstimada || 60)})`;
  }
}