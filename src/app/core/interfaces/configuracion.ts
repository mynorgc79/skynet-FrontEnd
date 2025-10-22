// Interfaces para el módulo de configuraciones del sistema

export interface Configuracion {
  id: number;
  clave: string;
  valor: string;
  categoria: CategoriaConfiguracion;
  descripcion?: string;
  tipo: TipoConfiguracion;
  valorPorDefecto: string;
  esPublica: boolean; // Si puede ser vista por usuarios no admin
  esEditable: boolean; // Si puede ser modificada
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number;
  modificadoPor?: number;
}

export enum CategoriaConfiguracion {
  GENERAL = 'GENERAL',
  EMAIL = 'EMAIL',
  MAPAS = 'MAPAS',
  RESPALDOS = 'RESPALDOS',
  SEGURIDAD = 'SEGURIDAD',
  NOTIFICACIONES = 'NOTIFICACIONES'
}

export enum TipoConfiguracion {
  TEXTO = 'TEXTO',
  NUMERO = 'NUMERO',
  BOOLEAN = 'BOOLEAN',
  EMAIL = 'EMAIL',
  URL = 'URL',
  PASSWORD = 'PASSWORD',
  JSON = 'JSON'
}

export interface ConfiguracionCreateDTO {
  clave: string;
  valor: string;
  categoria: CategoriaConfiguracion;
  descripcion?: string;
  tipo: TipoConfiguracion;
  valorPorDefecto: string;
  esPublica?: boolean;
  esEditable?: boolean;
}

export interface ConfiguracionUpdateDTO {
  valor?: string;
  descripcion?: string;
  esPublica?: boolean;
  esEditable?: boolean;
}

export interface ConfiguracionFilter {
  categoria?: CategoriaConfiguracion;
  esPublica?: boolean;
  esEditable?: boolean;
  buscar?: string;
}

// Interface para logs de auditoría
export interface LogAuditoria {
  id: number;
  entidad: string; // 'configuracion', 'usuario', 'cliente', 'visita'
  idEntidad: number;
  accion: AccionAuditoria;
  valorAnterior?: string;
  valorNuevo?: string;
  descripcion: string;
  direccionIP: string;
  userAgent: string;
  fechaCreacion: Date;
  creadoPor: number;
  // Relaciones
  usuario?: any; // Usuario que realizó la acción
}

export enum AccionAuditoria {
  CREAR = 'CREAR',
  ACTUALIZAR = 'ACTUALIZAR',
  ELIMINAR = 'ELIMINAR',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CAMBIO_PASSWORD = 'CAMBIO_PASSWORD',
  ACCESO_DENEGADO = 'ACCESO_DENEGADO'
}

export interface LogAuditoriaFilter {
  entidad?: string;
  accion?: AccionAuditoria;
  fechaDesde?: Date;
  fechaHasta?: Date;
  usuario?: number;
}

// Configuraciones específicas del sistema
export interface ConfiguracionEmail {
  smtpHost: string;
  smtpPort: number;
  smtpUsuario: string;
  smtpPassword: string;
  smtpSeguro: boolean;
  emailRemitente: string;
  nombreRemitente: string;
  plantillaReporte: string;
}

export interface ConfiguracionMapas {
  googleMapsApiKey: string;
  centroLatitud: number;
  centroLongitud: number;
  zoomPorDefecto: number;
  mostrarTrafico: boolean;
  tipoMapa: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

export interface ConfiguracionRespaldos {
  frecuenciaHoras: number;
  rutaRespaldos: string;
  manenerDias: number;
  incluirArchivos: boolean;
  emailNotificacion: string;
  habilitado: boolean;
}

export interface ConfiguracionSeguridad {
  tiempoSesionMinutos: number;
  intentosLoginMaximo: number;
  tiempoBloqueoMinutos: number;
  longitudMinimaPassword: number;
  requiereCaracteresEspeciales: boolean;
  requiereNumeros: boolean;
  requiereMayusculas: boolean;
  caducidadPasswordDias: number;
}

// DTO para configuraciones por categoría
export interface ConfiguracionesPorCategoria {
  categoria: CategoriaConfiguracion;
  configuraciones: Configuracion[];
  descripcion: string;
  icono: string;
}

// Interfaces para sistema de respaldos
export interface RespaldoSistema {
  id: number;
  tipo: TipoRespaldo;
  descripcion?: string;
  rutaArchivo: string;
  tamanoBytes: number;
  archivos?: string[]; // Lista de archivos incluidos en el respaldo
  estado: EstadoRespaldo;
  version?: string; // Versión del sistema al momento del respaldo
  fechaCreacion: Date;
  fechaFinalizacion?: Date;
  duracionSegundos?: number;
  creadoPor: number;
  comprimido: boolean;
  errorMensaje?: string; // En caso de que el respaldo falle
}

export enum TipoRespaldo {
  COMPLETO = 'COMPLETO',
  INCREMENTAL = 'INCREMENTAL',
  CONFIGURACIONES = 'CONFIGURACIONES',
  USUARIOS = 'USUARIOS',
  CLIENTES = 'CLIENTES'
}

export enum EstadoRespaldo {
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADO = 'COMPLETADO',
  FALLIDO = 'FALLIDO',
  CANCELADO = 'CANCELADO'
}

export interface RespaldoCreateDTO {
  tipo: TipoRespaldo;
  descripcion?: string;
  comprimido?: boolean;
}

export interface RespaldoFilter {
  tipo?: TipoRespaldo;
  estado?: EstadoRespaldo;
  fechaDesde?: Date;
  fechaHasta?: Date;
}