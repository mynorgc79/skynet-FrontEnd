// Enums para mejor tipado
export enum RoleTipo {
  ADMINISTRADOR = 'ADMINISTRADOR',
  SUPERVISOR = 'SUPERVISOR',
  TECNICO = 'TECNICO'
}

export enum EstadoVisita {
  PROGRAMADA = 'PROGRAMADA',
  EN_PROGRESO = 'EN_PROGRESO', 
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA'
}

export enum TipoEjecucion {
  INGRESO = 'INGRESO',
  EGRESO = 'EGRESO'
}

// Interfaces basadas en el ER
export interface Rol {
  id: number;
  rol: string; // ADMINISTRADOR, SUPERVISOR, TECNICO
}

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  password?: string; // Opcional para seguridad
  telefono?: string;
  rol: RoleTipo; // Cambiar rolId por rol directo
  idSupervisor?: number; // Para técnicos que reportan a un supervisor
  activo: boolean; // Cambiar estado por activo
  fechaCreacion: Date;
  fechaActualizacion: Date;
  // Relaciones
  supervisor?: Usuario;
  tecnicos?: Usuario[]; // Para supervisores
  visitasAsignadas?: Visita[];
}

export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  correo: string;
  email: string;
  coordenadasMaps: string; // Coordenadas para Google Maps
  latitud: number;
  longitud: number;
  // Relaciones
  visitas?: Visita[];
}

export interface Visita {
  idVisita: number;
  idCliente: number;
  idSupervisor: number;
  idTecnico: number;
  fechaVisita: Date;
  motivo: string;
  estado: string; // PROGRAMADA, EN_PROGRESO, COMPLETADA, CANCELADA
  // Relaciones
  cliente?: Cliente;
  supervisor?: Usuario;
  tecnico?: Usuario;
  ejecuciones?: Ejecucion[];
  reporte?: Reporte;
}

export interface Ejecucion {
  idEjecucion: number;
  idVisita: number;
  fechaIngreso?: Date;
  fechaEgreso?: Date;
  latitudIngreso?: number;
  longitudIngreso?: number;
  longitudEgreso?: number;
  fechaEgreso2?: Date; // Parece duplicado en el ER
  detalle?: string;
  marcarActuado?: boolean;
  // Relaciones
  visita?: Visita;
}

export interface Reporte {
  idReporte: number;
  idVisita: number;
  fecha: Date;
  rutaArchivo: string;
  emailEnviado: boolean;
  // Relaciones
  visita?: Visita;
}

// DTOs para transferencia de datos
export interface CreateUsuarioDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rolId: number;
}

export interface CreateClienteDto {
  nombre: string;
  apellido: string;
  correo: string;
  email: string;
  latitud: number;
  longitud: number;
}

export interface CreateVisitaDto {
  idCliente: number;
  idSupervisor: number;
  idTecnico: number;
  fechaVisita: Date;
  motivo: string;
}

export interface CreateEjecucionDto {
  idVisita: number;
  fechaIngreso?: Date;
  fechaEgreso?: Date;
  latitudIngreso?: number;
  longitudIngreso?: number;
  longitudEgreso?: number;
  detalle?: string;
}

// Interfaces para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interfaces para filtros y búsquedas
// DTOs para operaciones CRUD
export interface UsuarioFilter {
  nombre?: string;
  email?: string;
  rol?: RoleTipo;
  activo?: boolean;
}

export interface UsuarioCreateDTO {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  rol: RoleTipo;
  idSupervisor?: number;
  activo?: boolean;
}

export interface UsuarioUpdateDTO {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  rol?: RoleTipo;
  idSupervisor?: number;
  activo?: boolean;
}

export interface ClienteFilter {
  nombre?: string;
  email?: string;
  ciudad?: string;
}

export interface VisitaFilter {
  fechaDesde?: Date;
  fechaHasta?: Date;
  estado?: EstadoVisita;
  idTecnico?: number;
  idSupervisor?: number;
  idCliente?: number;
}