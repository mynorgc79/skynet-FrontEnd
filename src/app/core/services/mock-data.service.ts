import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { 
  Usuario, Cliente, Visita, RoleTipo, EstadoVisita,
  Configuracion, ConfiguracionCreateDTO, ConfiguracionUpdateDTO, ConfiguracionFilter,
  CategoriaConfiguracion, TipoConfiguracion, ConfiguracionesPorCategoria,
  LogAuditoria, LogAuditoriaFilter, AccionAuditoria,
  RespaldoSistema, RespaldoCreateDTO, RespaldoFilter, TipoRespaldo, EstadoRespaldo
} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  private configuraciones: Configuracion[] = [
    {
      id: 1,
      clave: 'NOMBRE_SISTEMA',
      valor: 'Skynet Field Service',
      categoria: CategoriaConfiguracion.GENERAL,
      descripcion: 'Nombre del sistema que aparece en la interfaz',
      tipo: TipoConfiguracion.TEXTO,
      valorPorDefecto: 'Field Service System',
      esPublica: true,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    {
      id: 2,
      clave: 'VERSION',
      valor: '1.0.0',
      categoria: CategoriaConfiguracion.GENERAL,
      descripcion: 'Versión actual del sistema',
      tipo: TipoConfiguracion.TEXTO,
      valorPorDefecto: '1.0.0',
      esPublica: true,
      esEditable: false,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    {
      id: 3,
      clave: 'GOOGLE_MAPS_API_KEY',
      valor: 'AIzaSyDemoKeyForDevelopment123456789',
      categoria: CategoriaConfiguracion.MAPAS,
      descripcion: 'API Key de Google Maps',
      tipo: TipoConfiguracion.PASSWORD,
      valorPorDefecto: '',
      esPublica: false,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    }
  ];

  private logsAuditoria: LogAuditoria[] = [
    {
      id: 1,
      entidad: 'usuario',
      idEntidad: 1,
      accion: AccionAuditoria.LOGIN,
      descripcion: 'Usuario admin@test.com inició sesión',
      direccionIP: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      fechaCreacion: new Date('2024-10-21T08:30:00'),
      creadoPor: 1
    }
  ];

  private respaldos: RespaldoSistema[] = [
    {
      id: 1,
      tipo: TipoRespaldo.COMPLETO,
      descripcion: 'Respaldo completo automático diario',
      rutaArchivo: '/respaldos/backup_completo_2024-12-11.tar.gz',
      tamanoBytes: 15728640,
      archivos: ['database_dump.sql', 'configuraciones.json'],
      estado: EstadoRespaldo.COMPLETADO,
      version: '1.0.0',
      fechaCreacion: new Date('2024-12-11T02:00:00'),
      fechaFinalizacion: new Date('2024-12-11T02:03:45'),
      duracionSegundos: 225,
      creadoPor: 1,
      comprimido: true
    }
  ];

  constructor() {}

  // Estadísticas simplificadas (solo para demostración en dashboard)
  getEstadisticasAdmin(): Observable<any> {
    return of({
      totalUsuarios: 0,
      clientesActivos: 0,
      visitasHoy: 0,
      reportesPendientes: 0
    }).pipe(delay(300));
  }

  getEstadisticasSupervisor(supervisorId: number): Observable<any> {
    return of({
      tecnicosACargo: 0,
      visitasProgramadas: 0,
      completadasHoy: 0,
      pendientes: 0
    }).pipe(delay(300));
  }

  getEstadisticasTecnico(tecnicoId: number): Observable<any> {
    return of({
      visitasHoy: 0,
      completadas: 0,
      pendientes: 0,
      distanciaTotal: '0km'
    }).pipe(delay(300));
  }

  // Actividad reciente simplificada
  getActividadReciente(userId: number): Observable<any[]> {
    const actividades = [
      {
        title: 'Sistema Integrado',
        description: 'Conectado con backend real',
        time: 'Ahora',
        type: 'success'
      }
    ];
    
    return of(actividades).pipe(delay(300));
  }

  // Métodos simplificados para compatibilidad
  getVisitas(): Observable<any[]> {
    return of([]).pipe(delay(300));
  }

  getVisitasData(filters?: any): Observable<any[]> {
    return of([]).pipe(delay(300));
  }

  getVisitaById(id: number): Observable<any> {
    return of(null).pipe(delay(300));
  }

  createVisita(visita: any): Observable<any> {
    return of(visita).pipe(delay(300));
  }

  updateVisita(id: number, visita: any): Observable<any> {
    return of(visita).pipe(delay(300));
  }

  deleteVisita(id: number): Observable<void> {
    return of(void 0).pipe(delay(300));
  }

  iniciarVisita(id: number): Observable<any> {
    return of(null).pipe(delay(300));
  }

  completarVisita(id: number, observaciones?: string): Observable<any> {
    return of(null).pipe(delay(300));
  }

  cancelarVisita(id: number, motivo?: string): Observable<any> {
    return of(null).pipe(delay(300));
  }

  getVisitasByTecnico(tecnicoId: number): Observable<any[]> {
    return of([]).pipe(delay(300));
  }

  getVisitasBySupervisor(supervisorId: number): Observable<any[]> {
    return of([]).pipe(delay(300));
  }

  getVisitasByCliente(clienteId: number): Observable<any[]> {
    return of([]).pipe(delay(300));
  }

  getVisitasHoy(): Observable<any[]> {
    return of([]).pipe(delay(300));
  }

  getTodasLasVisitasHoy(): Observable<any[]> {
    return of([]).pipe(delay(300));
  }

  getVisitasPorEstado(estado: any): Observable<any[]> {
    return of([]).pipe(delay(300));
  }

  getEstadisticasVisitas(): Observable<any> {
    return of({
      total: 0,
      programadas: 0,
      enProgreso: 0,
      completadas: 0,
      canceladas: 0
    }).pipe(delay(300));
  }

  getUsuarios(filters?: any): Observable<any[]> {
    return of([]).pipe(delay(300));
  }

  // Métodos de configuración que se necesitan
  getConfiguracionEmail(): Observable<any> {
    return of({
      smtpHost: '',
      smtpPort: 587,
      smtpUsuario: '',
      smtpPassword: '',
      smtpSeguro: true,
      emailRemitente: '',
      nombreRemitente: 'Sistema Skynet'
    }).pipe(delay(300));
  }

  getConfiguracionMapas(): Observable<any> {
    return of({
      googleMapsApiKey: '',
      centroLatitud: 14.634915,
      centroLongitud: -90.506882,
      zoomPorDefecto: 12,
      mostrarTrafico: true,
      tipoMapa: 'roadmap'
    }).pipe(delay(300));
  }

  getConfiguracionRespaldos(): Observable<any> {
    return of({
      frecuenciaHoras: 24,
      rutaRespaldos: '/var/backups/skynet',
      manenerDias: 30,
      incluirArchivos: true,
      emailNotificacion: 'admin@empresa.com',
      habilitado: true
    }).pipe(delay(300));
  }

  getConfiguracionSeguridad(): Observable<any> {
    return of({
      tiempoSesionMinutos: 480,
      intentosLoginMaximo: 3,
      tiempoBloqueoMinutos: 15,
      longitudMinimaPassword: 8,
      requiereCaracteresEspeciales: true,
      requiereNumeros: true,
      requiereMayusculas: true,
      caducidadPasswordDias: 90
    }).pipe(delay(300));
  }

  ejecutarRespaldo(): Observable<any> {
    const resultado = {
      exito: true,
      mensaje: 'Respaldo ejecutado correctamente',
      archivo: `backup_${new Date().toISOString().slice(0, 10)}_${Date.now()}.sql`,
      tamaño: '2.5 MB',
      fecha: new Date()
    };
    return of(resultado).pipe(delay(2000));
  }

  descargarRespaldo(id: number): Observable<Blob> {
    const content = `-- Respaldo de base de datos ID: ${id}\n-- Fecha: ${new Date().toISOString()}\n-- Contenido simulado`;
    const blob = new Blob([content], { type: 'application/sql' });
    return of(blob).pipe(delay(1000));
  }

  probarConfiguracionEmail(): Observable<{ exito: boolean; mensaje: string }> {
    const exito = Math.random() > 0.3;
    return of({
      exito,
      mensaje: exito ? 'Configuración de email válida. Email de prueba enviado.' : 'Error: No se pudo conectar al servidor SMTP.'
    }).pipe(delay(2000));
  }

  probarConfiguracionMapas(): Observable<{ exito: boolean; mensaje: string }> {
    const exito = Math.random() > 0.2;
    return of({
      exito,
      mensaje: exito ? 'API Key de Google Maps válida.' : 'Error: API Key inválida o sin permisos.'
    }).pipe(delay(1500));
  }

  // Solo métodos de configuraciones que se siguen usando
  getConfiguraciones(filters?: ConfiguracionFilter): Observable<Configuracion[]> {
    let filteredConfigs = [...this.configuraciones];
    
    if (filters) {
      if (filters.categoria) {
        filteredConfigs = filteredConfigs.filter(c => c.categoria === filters.categoria);
      }
      if (filters.esPublica !== undefined) {
        filteredConfigs = filteredConfigs.filter(c => c.esPublica === filters.esPublica);
      }
      if (filters.esEditable !== undefined) {
        filteredConfigs = filteredConfigs.filter(c => c.esEditable === filters.esEditable);
      }
      if (filters.buscar) {
        const buscar = filters.buscar.toLowerCase();
        filteredConfigs = filteredConfigs.filter(c => 
          c.clave.toLowerCase().includes(buscar) ||
          c.descripcion?.toLowerCase().includes(buscar) ||
          c.valor.toLowerCase().includes(buscar)
        );
      }
    }
    
    return of(filteredConfigs).pipe(delay(300));
  }

  getConfiguracionById(id: number): Observable<Configuracion> {
    const config = this.configuraciones.find(c => c.id === id);
    if (!config) {
      throw new Error(`Configuración con ID ${id} no encontrada`);
    }
    return of(config).pipe(delay(300));
  }

  createConfiguracion(configData: ConfiguracionCreateDTO): Observable<Configuracion> {
    const newConfig: Configuracion = {
      id: Math.max(...this.configuraciones.map(c => c.id)) + 1,
      ...configData,
      esPublica: configData.esPublica ?? false,
      esEditable: configData.esEditable ?? true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      creadoPor: 1,
      modificadoPor: undefined
    };
    
    this.configuraciones.push(newConfig);
    return of(newConfig).pipe(delay(300));
  }

  updateConfiguracion(id: number, updateData: ConfiguracionUpdateDTO): Observable<Configuracion> {
    const index = this.configuraciones.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Configuración con ID ${id} no encontrada`);
    }
    
    this.configuraciones[index] = {
      ...this.configuraciones[index],
      ...updateData,
      fechaActualizacion: new Date(),
      modificadoPor: 1
    };
    
    return of(this.configuraciones[index]).pipe(delay(300));
  }

  deleteConfiguracion(id: number): Observable<void> {
    const index = this.configuraciones.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Configuración con ID ${id} no encontrada`);
    }
    
    this.configuraciones.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }

  getConfiguracionesPorCategoria(): Observable<ConfiguracionesPorCategoria[]> {
    const categorias = Object.values(CategoriaConfiguracion);
    const result: ConfiguracionesPorCategoria[] = categorias.map(categoria => ({
      categoria,
      configuraciones: this.configuraciones.filter(c => c.categoria === categoria),
      descripcion: this.getCategoriaDescripcion(categoria),
      icono: this.getCategoriaIcono(categoria)
    }));
    
    return of(result).pipe(delay(300));
  }

  getConfiguracionValor(clave: string): Observable<string | null> {
    const config = this.configuraciones.find(c => c.clave === clave);
    return of(config ? config.valor : null).pipe(delay(100));
  }

  setConfiguracionValor(clave: string, valor: string): Observable<void> {
    const config = this.configuraciones.find(c => c.clave === clave);
    if (config) {
      config.valor = valor;
      config.fechaActualizacion = new Date();
      config.modificadoPor = 1;
    }
    return of(void 0).pipe(delay(300));
  }

  // Logs de auditoría
  getLogsAuditoria(filters?: LogAuditoriaFilter): Observable<LogAuditoria[]> {
    let filteredLogs = [...this.logsAuditoria];
    
    if (filters) {
      if (filters.entidad) {
        filteredLogs = filteredLogs.filter(l => l.entidad === filters.entidad);
      }
      if (filters.accion) {
        filteredLogs = filteredLogs.filter(l => l.accion === filters.accion);
      }
      if (filters.usuario) {
        filteredLogs = filteredLogs.filter(l => l.creadoPor === filters.usuario);
      }
      if (filters.fechaDesde) {
        filteredLogs = filteredLogs.filter(l => new Date(l.fechaCreacion) >= new Date(filters.fechaDesde!));
      }
      if (filters.fechaHasta) {
        filteredLogs = filteredLogs.filter(l => new Date(l.fechaCreacion) <= new Date(filters.fechaHasta!));
      }
    }
    
    filteredLogs.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
    
    return of(filteredLogs).pipe(delay(300));
  }

  createLogAuditoria(logData: Partial<LogAuditoria>): Observable<LogAuditoria> {
    const newLog: LogAuditoria = {
      id: Math.max(...this.logsAuditoria.map(l => l.id)) + 1,
      entidad: logData.entidad || '',
      idEntidad: logData.idEntidad || 0,
      accion: logData.accion || AccionAuditoria.ACTUALIZAR,
      descripcion: logData.descripcion || '',
      direccionIP: logData.direccionIP || '192.168.1.1',
      userAgent: logData.userAgent || 'Unknown',
      fechaCreacion: new Date(),
      creadoPor: logData.creadoPor || 1,
      valorAnterior: logData.valorAnterior,
      valorNuevo: logData.valorNuevo
    };
    
    this.logsAuditoria.push(newLog);
    return of(newLog).pipe(delay(300));
  }

  // Operaciones de respaldo
  getRespaldos(filters?: RespaldoFilter): Observable<RespaldoSistema[]> {
    let filteredRespaldos = [...this.respaldos];
    
    if (filters) {
      if (filters.tipo) {
        filteredRespaldos = filteredRespaldos.filter(r => r.tipo === filters.tipo);
      }
      if (filters.estado) {
        filteredRespaldos = filteredRespaldos.filter(r => r.estado === filters.estado);
      }
      if (filters.fechaDesde) {
        filteredRespaldos = filteredRespaldos.filter(r => 
          new Date(r.fechaCreacion) >= filters.fechaDesde!
        );
      }
      if (filters.fechaHasta) {
        filteredRespaldos = filteredRespaldos.filter(r => 
          new Date(r.fechaCreacion) <= filters.fechaHasta!
        );
      }
    }
    
    return of(filteredRespaldos).pipe(delay(300));
  }

  crearRespaldo(respaldoData: RespaldoCreateDTO): Observable<RespaldoSistema> {
    const newRespaldo: RespaldoSistema = {
      id: Math.max(...this.respaldos.map(r => r.id)) + 1,
      tipo: respaldoData.tipo,
      descripcion: respaldoData.descripcion || `Respaldo ${respaldoData.tipo} - ${new Date().toLocaleString('es-ES')}`,
      rutaArchivo: `/respaldos/backup_${respaldoData.tipo.toLowerCase()}_${Date.now()}.${respaldoData.comprimido ? 'tar.gz' : 'sql'}`,
      tamanoBytes: 0,
      archivos: [],
      estado: EstadoRespaldo.EN_PROGRESO,
      version: '1.0.0',
      fechaCreacion: new Date(),
      creadoPor: 1,
      comprimido: respaldoData.comprimido ?? true
    };

    this.respaldos.push(newRespaldo);

    setTimeout(() => {
      const respaldo = this.respaldos.find(r => r.id === newRespaldo.id);
      if (respaldo) {
        respaldo.estado = EstadoRespaldo.COMPLETADO;
        respaldo.fechaFinalizacion = new Date();
        respaldo.duracionSegundos = Math.floor(Math.random() * 300) + 30;
        respaldo.tamanoBytes = Math.floor(Math.random() * 20971520) + 1048576;
        respaldo.archivos = ['database_dump.sql', 'configuraciones.json'];
      }
    }, 5000);

    return of(newRespaldo).pipe(delay(500));
  }

  eliminarRespaldo(id: number): Observable<void> {
    const index = this.respaldos.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Respaldo con ID ${id} no encontrado`);
    }
    
    this.respaldos.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }

  restaurarRespaldo(id: number): Observable<{ exito: boolean; mensaje: string }> {
    const respaldo = this.respaldos.find(r => r.id === id);
    if (!respaldo) {
      throw new Error(`Respaldo con ID ${id} no encontrado`);
    }

    if (respaldo.estado !== EstadoRespaldo.COMPLETADO) {
      return of({
        exito: false,
        mensaje: 'Solo se pueden restaurar respaldos completados'
      }).pipe(delay(500));
    }

    const exito = Math.random() > 0.1;
    return of({
      exito,
      mensaje: exito 
        ? `Restauración completada exitosamente desde respaldo ${respaldo.tipo}`
        : 'Error durante la restauración. Verifique la integridad del archivo.'
    }).pipe(delay(3000));
  }

  // Métodos auxiliares
  private getCategoriaDescripcion(categoria: CategoriaConfiguracion): string {
    const descripciones = {
      [CategoriaConfiguracion.GENERAL]: 'Configuraciones generales del sistema',
      [CategoriaConfiguracion.EMAIL]: 'Configuraciones de correo electrónico y SMTP',
      [CategoriaConfiguracion.MAPAS]: 'Configuraciones de Google Maps y geolocalización',
      [CategoriaConfiguracion.RESPALDOS]: 'Configuraciones de respaldos automáticos',
      [CategoriaConfiguracion.SEGURIDAD]: 'Configuraciones de seguridad y autenticación',
      [CategoriaConfiguracion.NOTIFICACIONES]: 'Configuraciones de notificaciones del sistema'
    };
    return descripciones[categoria] || '';
  }

  private getCategoriaIcono(categoria: CategoriaConfiguracion): string {
    const iconos = {
      [CategoriaConfiguracion.GENERAL]: 'fas fa-cogs',
      [CategoriaConfiguracion.EMAIL]: 'fas fa-envelope',
      [CategoriaConfiguracion.MAPAS]: 'fas fa-map',
      [CategoriaConfiguracion.RESPALDOS]: 'fas fa-database',
      [CategoriaConfiguracion.SEGURIDAD]: 'fas fa-shield-alt',
      [CategoriaConfiguracion.NOTIFICACIONES]: 'fas fa-bell'
    };
    return iconos[categoria] || 'fas fa-cog';
  }
}