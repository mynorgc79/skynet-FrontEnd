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
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  // Coordenadas para Google Maps
  latitud: number;
  longitud: number;
  tipoCliente: 'INDIVIDUAL' | 'CORPORATIVO';
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  // Relaciones
  visitas?: Visita[];
}

export interface Visita {
  idVisita: number;
  clienteId: number;
  tecnicoId?: number;
  supervisorId?: number;
  fechaProgramada: Date;
  fechaInicio?: Date;
  fechaFin?: Date;
  estado: EstadoVisita;
  tipoVisita: 'MANTENIMIENTO' | 'INSTALACION' | 'SOPORTE' | 'INSPECCION' | 'REPARACION';
  descripcion?: string;
  observaciones?: string;
  latitud?: number;
  longitud?: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  
  // Relaciones
  cliente?: Cliente;
  tecnico?: Usuario;
  supervisor?: Usuario;
  ejecuciones?: Ejecucion[];
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
  contacto?: string;
  email?: string;
  tipoCliente?: 'INDIVIDUAL' | 'CORPORATIVO';
  activo?: boolean;
  departamento?: string;
}

export interface ClienteCreateDTO {
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  latitud: number;
  longitud: number;
  tipoCliente: 'INDIVIDUAL' | 'CORPORATIVO';
}

export interface ClienteUpdateDTO {
  nombre?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  tipoCliente?: 'INDIVIDUAL' | 'CORPORATIVO';
  activo?: boolean;
}

export interface VisitaFilter {
  fechaDesde?: Date;
  fechaHasta?: Date;
  estado?: EstadoVisita;
  tipoVisita?: 'MANTENIMIENTO' | 'INSTALACION' | 'SOPORTE' | 'INSPECCION' | 'REPARACION';
  tecnicoId?: number;
  supervisorId?: number;
  clienteId?: number;
}

export interface VisitaCreateDTO {
  cliente: number;
  tecnico?: number;
  supervisor?: number;
  fecha_programada: string; // ISO string para el backend
  tipo_visita: 'MANTENIMIENTO' | 'INSTALACION' | 'SOPORTE' | 'INSPECCION' | 'REPARACION';
  descripcion?: string;
  observaciones?: string;
  latitud?: number;
  longitud?: number;
}

export interface VisitaUpdateDTO {
  cliente?: number;
  tecnico?: number;
  supervisor?: number;
  fecha_programada?: string;
  tipo_visita?: 'MANTENIMIENTO' | 'INSTALACION' | 'SOPORTE' | 'INSPECCION' | 'REPARACION';
  descripcion?: string;
  observaciones?: string;
  latitud?: number;
  longitud?: number;
}

// Re-exportar interfaces de configuración
export * from './configuracion';