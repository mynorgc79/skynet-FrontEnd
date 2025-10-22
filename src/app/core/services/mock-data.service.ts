import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { 
  Usuario, Cliente, Visita, Ejecucion, 
  UsuarioFilter, UsuarioCreateDTO, UsuarioUpdateDTO, RoleTipo, 
  ClienteFilter, ClienteCreateDTO, ClienteUpdateDTO, 
  VisitaFilter, VisitaCreateDTO, VisitaUpdateDTO, EstadoVisita,
  Configuracion, ConfiguracionCreateDTO, ConfiguracionUpdateDTO, ConfiguracionFilter,
  CategoriaConfiguracion, TipoConfiguracion, ConfiguracionesPorCategoria,
  LogAuditoria, LogAuditoriaFilter, AccionAuditoria,
  RespaldoSistema, RespaldoCreateDTO, RespaldoFilter, TipoRespaldo, EstadoRespaldo
} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  private usuarios: Usuario[] = [
    {
      idUsuario: 1,
      nombre: 'Juan Carlos',
      apellido: 'Administrador',
      email: 'admin@test.com',
      telefono: '+502 2234-5678',
      rol: RoleTipo.ADMINISTRADOR,
      activo: true,
      fechaCreacion: new Date('2024-01-15'),
      fechaActualizacion: new Date('2024-01-15')
    },
    {
      idUsuario: 2,
      nombre: 'María Elena',
      apellido: 'Supervisor',
      email: 'supervisor@test.com',
      telefono: '+502 5678-9012',
      rol: RoleTipo.SUPERVISOR,
      activo: true,
      fechaCreacion: new Date('2024-02-01'),
      fechaActualizacion: new Date('2024-02-01')
    },
    {
      idUsuario: 3,
      nombre: 'Carlos',
      apellido: 'Técnico Pérez',
      email: 'tecnico@test.com',
      telefono: '+502 3456-7890',
      rol: RoleTipo.TECNICO,
      idSupervisor: 2,
      activo: true,
      fechaCreacion: new Date('2024-02-15'),
      fechaActualizacion: new Date('2024-02-15')
    },
    {
      idUsuario: 4,
      nombre: 'Ana',
      apellido: 'Supervisor García',
      email: 'ana.garcia@test.com',
      telefono: '+502 7890-1234',
      rol: RoleTipo.SUPERVISOR,
      activo: true,
      fechaCreacion: new Date('2024-03-01'),
      fechaActualizacion: new Date('2024-03-01')
    },
    {
      idUsuario: 5,
      nombre: 'Luis',
      apellido: 'Técnico Rodríguez',
      email: 'luis.rodriguez@test.com',
      telefono: '+502 4567-8901',
      rol: RoleTipo.TECNICO,
      idSupervisor: 2,
      activo: true,
      fechaCreacion: new Date('2024-03-15'),
      fechaActualizacion: new Date('2024-03-15')
    },
    {
      idUsuario: 6,
      nombre: 'Elena',
      apellido: 'Técnico Martínez',
      email: 'elena.martinez@test.com',
      telefono: '+502 6789-0123',
      rol: RoleTipo.TECNICO,
      idSupervisor: 4,
      activo: true,
      fechaCreacion: new Date('2024-04-01'),
      fechaActualizacion: new Date('2024-04-01')
    },
    {
      idUsuario: 7,
      nombre: 'Pedro',
      apellido: 'Técnico López',
      email: 'pedro.lopez@test.com',
      telefono: '+502 5432-1098',
      rol: RoleTipo.TECNICO,
      idSupervisor: 4,
      activo: false,
      fechaCreacion: new Date('2024-05-01'),
      fechaActualizacion: new Date('2024-09-15')
    }
  ];

  private clientes: Cliente[] = [
    {
      idCliente: 1,
      nombre: 'Juan Carlos',
      apellido: 'Pérez López',
      email: 'juan.perez@empresaabc.com',
      telefono: '+502 2234-5678',
      empresa: 'Empresa ABC S.A.',
      direccion: '15 Avenida 12-34 Zona 10',
      ciudad: 'Guatemala',
      departamento: 'Guatemala',
      codigoPostal: '01010',
      latitud: 14.6084,
      longitud: -90.5253,
      coordenadasMaps: '14.6084,-90.5253',
      activo: true,
      fechaCreacion: new Date('2024-01-15'),
      fechaActualizacion: new Date('2024-01-15')
    },
    {
      idCliente: 2,
      nombre: 'María Elena',
      apellido: 'García Morales',
      email: 'maria.garcia@techsolutions.com',
      telefono: '+502 5678-9012',
      empresa: 'Tech Solutions Ltd.',
      direccion: '7ma Calle 8-45 Zona 9',
      ciudad: 'Guatemala',
      departamento: 'Guatemala',
      codigoPostal: '01009',
      latitud: 14.6349,
      longitud: -90.5069,
      coordenadasMaps: '14.6349,-90.5069',
      activo: true,
      fechaCreacion: new Date('2024-02-01'),
      fechaActualizacion: new Date('2024-02-01')
    },
    {
      idCliente: 3,
      nombre: 'Carlos Antonio',
      apellido: 'Rodríguez Silva',
      email: 'carlos.rodriguez@globalcorp.gt',
      telefono: '+502 3456-7890',
      empresa: 'Global Corp Guatemala',
      direccion: '12 Calle 15-67 Zona 14',
      ciudad: 'Guatemala',
      departamento: 'Guatemala',
      codigoPostal: '01014',
      latitud: 14.5986,
      longitud: -90.5144,
      coordenadasMaps: '14.5986,-90.5144',
      activo: true,
      fechaCreacion: new Date('2024-02-15'),
      fechaActualizacion: new Date('2024-02-15')
    },
    {
      idCliente: 4,
      nombre: 'Ana Lucía',
      apellido: 'Martínez Hernández',
      email: 'ana.martinez@innovatech.com.gt',
      telefono: '+502 7890-1234',
      empresa: 'Innova Tech Guatemala',
      direccion: '3ra Avenida 9-23 Zona 1',
      ciudad: 'Guatemala',
      departamento: 'Guatemala',
      codigoPostal: '01001',
      latitud: 14.6407,
      longitud: -90.5137,
      coordenadasMaps: '14.6407,-90.5137',
      activo: true,
      fechaCreacion: new Date('2024-03-01'),
      fechaActualizacion: new Date('2024-03-01')
    },
    {
      idCliente: 5,
      nombre: 'Luis Fernando',
      apellido: 'Castillo Méndez',
      email: 'luis.castillo@dataflow.gt',
      telefono: '+502 4567-8901',
      empresa: 'DataFlow Solutions',
      direccion: '18 Calle 25-34 Zona 15',
      ciudad: 'Guatemala',
      departamento: 'Guatemala',
      codigoPostal: '01015',
      latitud: 14.5894,
      longitud: -90.4896,
      coordenadasMaps: '14.5894,-90.4896',
      activo: true,
      fechaCreacion: new Date('2024-03-15'),
      fechaActualizacion: new Date('2024-03-15')
    },
    {
      idCliente: 6,
      nombre: 'Patricia Isabel',
      apellido: 'Vásquez Torres',
      email: 'patricia.vasquez@netcorp.com.gt',
      telefono: '+502 6789-0123',
      empresa: 'NetCorp Guatemala',
      direccion: '5ta Avenida 14-78 Zona 4',
      ciudad: 'Mixco',
      departamento: 'Guatemala',
      codigoPostal: '01057',
      latitud: 14.6308,
      longitud: -90.6067,
      coordenadasMaps: '14.6308,-90.6067',
      activo: true,
      fechaCreacion: new Date('2024-04-01'),
      fechaActualizacion: new Date('2024-04-01')
    },
    {
      idCliente: 7,
      nombre: 'Roberto Carlos',
      apellido: 'Juárez Morales',
      email: 'roberto.juarez@cloudtech.gt',
      telefono: '+502 5432-1098',
      empresa: 'CloudTech Guatemala',
      direccion: '20 Calle 12-45 Zona 11',
      ciudad: 'Villa Nueva',
      departamento: 'Guatemala',
      codigoPostal: '01011',
      latitud: 14.5252,
      longitud: -90.5881,
      coordenadasMaps: '14.5252,-90.5881',
      activo: false,
      fechaCreacion: new Date('2024-05-01'),
      fechaActualizacion: new Date('2024-09-15')
    },
    {
      idCliente: 8,
      nombre: 'Sofía Alejandra',
      apellido: 'López Ramírez',
      email: 'sofia.lopez@digitalworld.com.gt',
      telefono: '+502 2468-1357',
      empresa: 'Digital World GT',
      direccion: '8va Calle 16-23 Zona 13',
      ciudad: 'Antigua Guatemala',
      departamento: 'Sacatepéquez',
      codigoPostal: '03001',
      latitud: 14.5586,
      longitud: -90.7344,
      coordenadasMaps: '14.5586,-90.7344',
      activo: true,
      fechaCreacion: new Date('2024-06-01'),
      fechaActualizacion: new Date('2024-06-01')
    }
  ];

  private visitas: Visita[] = [
    {
      idVisita: 1,
      idCliente: 1,
      idSupervisor: 2,
      idTecnico: 3,
      fechaVisita: new Date('2024-10-21'),
      horaInicio: '09:00',
      horaFin: '11:30',
      motivo: 'Mantenimiento preventivo de equipos',
      descripcion: 'Revisión general de servidores, actualización de sistemas y limpieza de equipos',
      prioridad: 'MEDIA',
      estado: 'COMPLETADA' as any,
      observaciones: 'Mantenimiento completado satisfactoriamente. Se recomienda próxima revisión en 3 meses.',
      duracionEstimada: 150,
      fechaCreacion: new Date('2024-10-15'),
      fechaActualizacion: new Date('2024-10-21')
    },
    {
      idVisita: 2,
      idCliente: 2,
      idSupervisor: 2,
      idTecnico: 5,
      fechaVisita: new Date('2024-10-21'),
      horaInicio: '11:00',
      horaFin: undefined,
      motivo: 'Instalación de nuevo servidor',
      descripcion: 'Instalación y configuración del nuevo servidor Dell PowerEdge',
      prioridad: 'ALTA',
      estado: 'EN_PROGRESO' as any,
      observaciones: 'Instalación en progreso, estimado de finalización: 15:00',
      duracionEstimada: 240,
      fechaCreacion: new Date('2024-10-16'),
      fechaActualizacion: new Date('2024-10-21')
    },
    {
      idVisita: 3,
      idCliente: 3,
      idSupervisor: 2,
      idTecnico: 3,
      fechaVisita: new Date('2024-10-21'),
      horaInicio: '14:00',
      horaFin: undefined,
      motivo: 'Soporte técnico urgente',
      descripcion: 'Resolución de problemas críticos en el sistema de facturación',
      prioridad: 'URGENTE',
      estado: 'PROGRAMADA' as any,
      observaciones: 'Cliente reporta sistema caído desde las 12:00. Prioridad máxima.',
      duracionEstimada: 120,
      fechaCreacion: new Date('2024-10-21'),
      fechaActualizacion: new Date('2024-10-21')
    },
    {
      idVisita: 4,
      idCliente: 4,
      idSupervisor: 4,
      idTecnico: 6,
      fechaVisita: new Date('2024-10-22'),
      horaInicio: '10:00',
      horaFin: undefined,
      motivo: 'Actualización de software',
      descripcion: 'Actualización del sistema ERP a la versión más reciente',
      prioridad: 'MEDIA',
      estado: 'PROGRAMADA' as any,
      observaciones: 'Requiere backup completo antes de la actualización',
      duracionEstimada: 180,
      fechaCreacion: new Date('2024-10-17'),
      fechaActualizacion: new Date('2024-10-17')
    },
    {
      idVisita: 5,
      idCliente: 5,
      idSupervisor: 2,
      idTecnico: 5,
      fechaVisita: new Date('2024-10-22'),
      horaInicio: '08:30',
      horaFin: undefined,
      motivo: 'Capacitación de usuarios',
      descripcion: 'Capacitación del personal en el uso del nuevo sistema',
      prioridad: 'BAJA',
      estado: 'PROGRAMADA' as any,
      observaciones: 'Sesión de capacitación para 8 usuarios',
      duracionEstimada: 120,
      fechaCreacion: new Date('2024-10-18'),
      fechaActualizacion: new Date('2024-10-18')
    },
    {
      idVisita: 6,
      idCliente: 6,
      idSupervisor: 4,
      idTecnico: 6,
      fechaVisita: new Date('2024-10-23'),
      horaInicio: '09:30',
      horaFin: undefined,
      motivo: 'Instalación de equipos nuevos',
      descripcion: 'Instalación de 5 computadoras nuevas y configuración de red',
      prioridad: 'MEDIA',
      estado: 'PROGRAMADA' as any,
      observaciones: 'Equipos ya están en las instalaciones del cliente',
      duracionEstimada: 200,
      fechaCreacion: new Date('2024-10-19'),
      fechaActualizacion: new Date('2024-10-19')
    },
    {
      idVisita: 7,
      idCliente: 1,
      idSupervisor: 2,
      idTecnico: 3,
      fechaVisita: new Date('2024-10-18'),
      horaInicio: '16:00',
      horaFin: '17:15',
      motivo: 'Backup de seguridad',
      descripcion: 'Verificación y actualización del sistema de backup automático',
      prioridad: 'MEDIA',
      estado: 'COMPLETADA' as any,
      observaciones: 'Backup funcionando correctamente. Se configuró frecuencia diaria.',
      duracionEstimada: 75,
      fechaCreacion: new Date('2024-10-14'),
      fechaActualizacion: new Date('2024-10-18')
    },
    {
      idVisita: 8,
      idCliente: 8,
      idSupervisor: 4,
      idTecnico: 6,
      fechaVisita: new Date('2024-10-17'),
      horaInicio: '13:00',
      horaFin: '13:45',
      motivo: 'Consultoría técnica',
      descripcion: 'Evaluación de infraestructura actual y recomendaciones de mejora',
      prioridad: 'BAJA',
      estado: 'COMPLETADA' as any,
      observaciones: 'Se entregó reporte con recomendaciones de mejora.',
      duracionEstimada: 60,
      fechaCreacion: new Date('2024-10-12'),
      fechaActualizacion: new Date('2024-10-17')
    }
  ];

  constructor() {
    // Agregar relaciones a las visitas
    this.visitas.forEach(visita => {
      visita.cliente = this.clientes.find(c => c.idCliente === visita.idCliente);
      visita.supervisor = this.usuarios.find(u => u.idUsuario === visita.idSupervisor);
      visita.tecnico = this.usuarios.find(u => u.idUsuario === visita.idTecnico);
    });
  }

  // Métodos para obtener datos (se mantiene solo el método con filtros)

  getClientes(): Observable<Cliente[]> {
    return of(this.clientes).pipe(delay(300));
  }

  getVisitas(): Observable<Visita[]> {
    return of(this.visitas).pipe(delay(300));
  }

  // Estadísticas por rol
  getEstadisticasAdmin(): Observable<any> {
    return of({
      totalUsuarios: this.usuarios.length,
      clientesActivos: this.clientes.length,
      visitasHoy: this.visitas.filter(v => this.isToday(v.fechaVisita)).length,
      reportesPendientes: 3
    }).pipe(delay(300));
  }

  getEstadisticasSupervisor(supervisorId: number): Observable<any> {
    const visitasEquipo = this.visitas.filter(v => v.idSupervisor === supervisorId);
    const visitasHoy = visitasEquipo.filter(v => this.isToday(v.fechaVisita));
    
    return of({
      tecnicosACargo: this.usuarios.filter(u => u.rol === RoleTipo.TECNICO).length,
      visitasProgramadas: visitasEquipo.filter(v => v.estado === 'PROGRAMADA').length,
      completadasHoy: visitasHoy.filter(v => v.estado === 'COMPLETADA').length,
      pendientes: visitasHoy.filter(v => v.estado === 'PROGRAMADA').length
    }).pipe(delay(300));
  }

  getEstadisticasTecnico(tecnicoId: number): Observable<any> {
    const visitasTecnico = this.visitas.filter(v => v.idTecnico === tecnicoId);
    const visitasHoy = visitasTecnico.filter(v => this.isToday(v.fechaVisita));
    
    return of({
      visitasHoy: visitasHoy.length,
      completadas: visitasHoy.filter(v => v.estado === 'COMPLETADA').length,
      pendientes: visitasHoy.filter(v => v.estado === 'PROGRAMADA').length,
      distanciaTotal: '45km'
    }).pipe(delay(300));
  }

  // Visitas por usuario
  getVisitasByTecnico(tecnicoId: number): Observable<Visita[]> {
    const visitas = this.visitas.filter(v => v.idTecnico === tecnicoId && this.isToday(v.fechaVisita));
    return of(visitas).pipe(delay(300));
  }

  getTecnicosBySupervisor(supervisorId: number): Observable<Usuario[]> {
    return of(this.usuarios.filter(u => 
      u.rol === RoleTipo.TECNICO && u.idSupervisor === supervisorId
    ));
  }

  // Métodos CRUD para usuarios
  getUsuarios(filters?: UsuarioFilter): Observable<Usuario[]> {
    let filteredUsers = [...this.usuarios];
    
    if (filters) {
      if (filters.nombre) {
        filteredUsers = filteredUsers.filter(u => 
          u.nombre.toLowerCase().includes(filters.nombre!.toLowerCase()) ||
          u.apellido.toLowerCase().includes(filters.nombre!.toLowerCase())
        );
      }
      if (filters.email) {
        filteredUsers = filteredUsers.filter(u => 
          u.email.toLowerCase().includes(filters.email!.toLowerCase())
        );
      }
      if (filters.rol) {
        filteredUsers = filteredUsers.filter(u => u.rol === filters.rol);
      }
      if (filters.activo !== undefined) {
        filteredUsers = filteredUsers.filter(u => u.activo === filters.activo);
      }
    }
    
    return of(filteredUsers);
  }

  getUsuarioById(id: number): Observable<Usuario> {
    const usuario = this.usuarios.find(u => u.idUsuario === id);
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return of(usuario);
  }

  createUsuario(usuarioData: UsuarioCreateDTO): Observable<Usuario> {
    const newUsuario: Usuario = {
      idUsuario: Math.max(...this.usuarios.map(u => u.idUsuario)) + 1,
      ...usuarioData,
      activo: usuarioData.activo ?? true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };
    
    this.usuarios.push(newUsuario);
    return of(newUsuario);
  }

  updateUsuario(id: number, updateData: UsuarioUpdateDTO): Observable<Usuario> {
    const index = this.usuarios.findIndex(u => u.idUsuario === id);
    if (index === -1) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    
    this.usuarios[index] = {
      ...this.usuarios[index],
      ...updateData,
      fechaActualizacion: new Date()
    };
    
    return of(this.usuarios[index]);
  }

  deleteUsuario(id: number): Observable<void> {
    const index = this.usuarios.findIndex(u => u.idUsuario === id);
    if (index === -1) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    
    this.usuarios.splice(index, 1);
    return of(void 0);
  }

  changeUserPassword(id: number, newPassword: string): Observable<void> {
    const usuario = this.usuarios.find(u => u.idUsuario === id);
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    
    // En un entorno real, aquí se encriptaría la contraseña
    (usuario as any).password = newPassword;
    usuario.fechaActualizacion = new Date();
    
    return of(void 0);
  }

  toggleUserStatus(id: number): Observable<Usuario> {
    const usuario = this.usuarios.find(u => u.idUsuario === id);
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    
    usuario.activo = !usuario.activo;
    usuario.fechaActualizacion = new Date();
    
    return of(usuario);
  }

  getTodasLasVisitasHoy(): Observable<Visita[]> {
    const visitas = this.visitas.filter(v => this.isToday(v.fechaVisita));
    return of(visitas).pipe(delay(300));
  }

  // Actividad reciente
  getActividadReciente(userId: number): Observable<any[]> {
    const actividades = [
      {
        title: 'Visita Completada',
        description: 'Mantenimiento preventivo en Empresa ABC',
        time: 'Hace 15 min',
        type: 'success'
      },
      {
        title: 'Nueva Visita Programada',
        description: 'Instalación programada para mañana',
        time: 'Hace 1 hora',
        type: 'primary'
      },
      {
        title: 'Reporte Generado',
        description: 'Reporte de visita enviado al cliente',
        time: 'Hace 2 horas',
        type: 'info'
      }
    ];
    
    return of(actividades).pipe(delay(300));
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    const visitDate = new Date(date);
    return visitDate.toDateString() === today.toDateString();
  }

  // Métodos CRUD para clientes
  getClientesData(filters?: ClienteFilter): Observable<Cliente[]> {
    let filteredClientes = [...this.clientes];
    
    if (filters) {
      if (filters.nombre) {
        filteredClientes = filteredClientes.filter(c => 
          c.nombre.toLowerCase().includes(filters.nombre!.toLowerCase()) ||
          c.apellido.toLowerCase().includes(filters.nombre!.toLowerCase())
        );
      }
      if (filters.empresa) {
        filteredClientes = filteredClientes.filter(c => 
          c.empresa?.toLowerCase().includes(filters.empresa!.toLowerCase())
        );
      }
      if (filters.ciudad) {
        filteredClientes = filteredClientes.filter(c => 
          c.ciudad.toLowerCase().includes(filters.ciudad!.toLowerCase())
        );
      }
      if (filters.departamento) {
        filteredClientes = filteredClientes.filter(c => 
          c.departamento.toLowerCase().includes(filters.departamento!.toLowerCase())
        );
      }
      if (filters.activo !== undefined) {
        filteredClientes = filteredClientes.filter(c => c.activo === filters.activo);
      }
    }
    
    return of(filteredClientes).pipe(delay(300));
  }

  getClienteById(id: number): Observable<Cliente> {
    const cliente = this.clientes.find(c => c.idCliente === id);
    if (!cliente) {
      throw new Error(`Cliente con ID ${id} no encontrado`);
    }
    return of(cliente).pipe(delay(300));
  }

  createCliente(clienteData: ClienteCreateDTO): Observable<Cliente> {
    const newCliente: Cliente = {
      idCliente: Math.max(...this.clientes.map(c => c.idCliente)) + 1,
      ...clienteData,
      coordenadasMaps: `${clienteData.latitud},${clienteData.longitud}`,
      activo: clienteData.activo ?? true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };
    
    this.clientes.push(newCliente);
    return of(newCliente).pipe(delay(300));
  }

  updateCliente(id: number, updateData: ClienteUpdateDTO): Observable<Cliente> {
    const index = this.clientes.findIndex(c => c.idCliente === id);
    if (index === -1) {
      throw new Error(`Cliente con ID ${id} no encontrado`);
    }
    
    // Actualizar coordenadasMaps si se cambian lat/lng
    if (updateData.latitud !== undefined && updateData.longitud !== undefined) {
      updateData.coordenadasMaps = `${updateData.latitud},${updateData.longitud}`;
    }
    
    this.clientes[index] = {
      ...this.clientes[index],
      ...updateData,
      fechaActualizacion: new Date()
    };
    
    return of(this.clientes[index]).pipe(delay(300));
  }

  deleteCliente(id: number): Observable<void> {
    const index = this.clientes.findIndex(c => c.idCliente === id);
    if (index === -1) {
      throw new Error(`Cliente con ID ${id} no encontrado`);
    }
    
    this.clientes.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }

  toggleClienteStatus(id: number): Observable<Cliente> {
    const cliente = this.clientes.find(c => c.idCliente === id);
    if (!cliente) {
      throw new Error(`Cliente con ID ${id} no encontrado`);
    }
    
    cliente.activo = !cliente.activo;
    cliente.fechaActualizacion = new Date();
    
    return of(cliente).pipe(delay(300));
  }

  // Métodos específicos para clientes
  getClientesByDepartamento(departamento: string): Observable<Cliente[]> {
    return this.getClientesData({ departamento });
  }

  getClientesActivos(): Observable<Cliente[]> {
    return this.getClientesData({ activo: true });
  }

  searchClientesByLocation(lat: number, lng: number, radiusKm: number = 10): Observable<Cliente[]> {
    // Filtrar clientes dentro del radio especificado
    const filtered = this.clientes.filter(cliente => {
      const distance = this.calculateDistance(lat, lng, cliente.latitud, cliente.longitud);
      return distance <= radiusKm;
    });
    
    return of(filtered).pipe(delay(300));
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Fórmula de Haversine para calcular distancia entre dos puntos
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Métodos CRUD para visitas
  getVisitasData(filters?: VisitaFilter): Observable<Visita[]> {
    let filteredVisitas = [...this.visitas];
    
    if (filters) {
      if (filters.fechaDesde) {
        filteredVisitas = filteredVisitas.filter(v => 
          new Date(v.fechaVisita) >= new Date(filters.fechaDesde!)
        );
      }
      if (filters.fechaHasta) {
        filteredVisitas = filteredVisitas.filter(v => 
          new Date(v.fechaVisita) <= new Date(filters.fechaHasta!)
        );
      }
      if (filters.estado) {
        filteredVisitas = filteredVisitas.filter(v => v.estado === filters.estado);
      }
      if (filters.prioridad) {
        filteredVisitas = filteredVisitas.filter(v => v.prioridad === filters.prioridad);
      }
      if (filters.idTecnico) {
        filteredVisitas = filteredVisitas.filter(v => v.idTecnico === filters.idTecnico);
      }
      if (filters.idSupervisor) {
        filteredVisitas = filteredVisitas.filter(v => v.idSupervisor === filters.idSupervisor);
      }
      if (filters.idCliente) {
        filteredVisitas = filteredVisitas.filter(v => v.idCliente === filters.idCliente);
      }
    }
    
    // Ordenar por fecha de visita
    filteredVisitas.sort((a, b) => new Date(a.fechaVisita).getTime() - new Date(b.fechaVisita).getTime());
    
    return of(filteredVisitas).pipe(delay(300));
  }

  getVisitaById(id: number): Observable<Visita> {
    const visita = this.visitas.find(v => v.idVisita === id);
    if (!visita) {
      throw new Error(`Visita con ID ${id} no encontrada`);
    }
    
    // Agregar datos relacionados
    const visitaCompleta = {
      ...visita,
      cliente: this.clientes.find(c => c.idCliente === visita.idCliente),
      supervisor: this.usuarios.find(u => u.idUsuario === visita.idSupervisor),
      tecnico: this.usuarios.find(u => u.idUsuario === visita.idTecnico)
    };
    
    return of(visitaCompleta).pipe(delay(300));
  }

  createVisita(visitaData: VisitaCreateDTO): Observable<Visita> {
    const newVisita: Visita = {
      idVisita: Math.max(...this.visitas.map(v => v.idVisita)) + 1,
      ...visitaData,
      estado: EstadoVisita.PROGRAMADA,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };
    
    this.visitas.push(newVisita);
    return of(newVisita).pipe(delay(300));
  }

  updateVisita(id: number, updateData: VisitaUpdateDTO): Observable<Visita> {
    const index = this.visitas.findIndex(v => v.idVisita === id);
    if (index === -1) {
      throw new Error(`Visita con ID ${id} no encontrada`);
    }
    
    this.visitas[index] = {
      ...this.visitas[index],
      ...updateData,
      fechaActualizacion: new Date()
    };
    
    return of(this.visitas[index]).pipe(delay(300));
  }

  deleteVisita(id: number): Observable<void> {
    const index = this.visitas.findIndex(v => v.idVisita === id);
    if (index === -1) {
      throw new Error(`Visita con ID ${id} no encontrada`);
    }
    
    this.visitas.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }

  // Métodos específicos para visitas
  iniciarVisita(id: number): Observable<Visita> {
    const visita = this.visitas.find(v => v.idVisita === id);
    if (!visita) {
      throw new Error(`Visita con ID ${id} no encontrada`);
    }
    
    if (visita.estado !== EstadoVisita.PROGRAMADA) {
      throw new Error('Solo se pueden iniciar visitas programadas');
    }
    
    visita.estado = EstadoVisita.EN_PROGRESO;
    visita.fechaActualizacion = new Date();
    
    return of(visita).pipe(delay(300));
  }

  completarVisita(id: number, observaciones?: string): Observable<Visita> {
    const visita = this.visitas.find(v => v.idVisita === id);
    if (!visita) {
      throw new Error(`Visita con ID ${id} no encontrada`);
    }
    
    if (visita.estado !== EstadoVisita.EN_PROGRESO) {
      throw new Error('Solo se pueden completar visitas en progreso');
    }
    
    visita.estado = EstadoVisita.COMPLETADA;
    visita.horaFin = new Date().toTimeString().slice(0, 5);
    if (observaciones) {
      visita.observaciones = observaciones;
    }
    visita.fechaActualizacion = new Date();
    
    return of(visita).pipe(delay(300));
  }

  cancelarVisita(id: number, motivo?: string): Observable<Visita> {
    const visita = this.visitas.find(v => v.idVisita === id);
    if (!visita) {
      throw new Error(`Visita con ID ${id} no encontrada`);
    }
    
    if (visita.estado === EstadoVisita.COMPLETADA) {
      throw new Error('No se pueden cancelar visitas completadas');
    }
    
    visita.estado = EstadoVisita.CANCELADA;
    if (motivo) {
      visita.observaciones = `Cancelada: ${motivo}`;
    }
    visita.fechaActualizacion = new Date();
    
    return of(visita).pipe(delay(300));
  }

  

  getVisitasBySupervisor(supervisorId: number): Observable<Visita[]> {
    return this.getVisitasData({ idSupervisor: supervisorId });
  }

  getVisitasByCliente(clienteId: number): Observable<Visita[]> {
    return this.getVisitasData({ idCliente: clienteId });
  }

  getVisitasHoy(): Observable<Visita[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    
    return this.getVisitasData({
      fechaDesde: hoy,
      fechaHasta: manana
    });
  }

  getVisitasPorEstado(estado: EstadoVisita): Observable<Visita[]> {
    return this.getVisitasData({ estado });
  }

  getEstadisticasVisitas(): Observable<any> {
    const estadisticas = {
      total: this.visitas.length,
      programadas: this.visitas.filter(v => v.estado === EstadoVisita.PROGRAMADA).length,
      enProgreso: this.visitas.filter(v => v.estado === EstadoVisita.EN_PROGRESO).length,
      completadas: this.visitas.filter(v => v.estado === EstadoVisita.COMPLETADA).length,
      canceladas: this.visitas.filter(v => v.estado === EstadoVisita.CANCELADA).length,
      porPrioridad: {
        urgente: this.visitas.filter(v => v.prioridad === 'URGENTE').length,
        alta: this.visitas.filter(v => v.prioridad === 'ALTA').length,
        media: this.visitas.filter(v => v.prioridad === 'MEDIA').length,
        baja: this.visitas.filter(v => v.prioridad === 'BAJA').length
      }
    };
    
    return of(estadisticas).pipe(delay(300));
  }

  // ===== CONFIGURACIONES Y LOGS =====
  
  // Datos mock de configuraciones del sistema
  private configuraciones: Configuracion[] = [
    // Configuraciones generales
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
      clave: 'TIMEZONE',
      valor: 'America/Guatemala',
      categoria: CategoriaConfiguracion.GENERAL,
      descripcion: 'Zona horaria del sistema',
      tipo: TipoConfiguracion.TEXTO,
      valorPorDefecto: 'America/Guatemala',
      esPublica: true,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    
    // Configuraciones de email
    {
      id: 4,
      clave: 'SMTP_HOST',
      valor: 'smtp.gmail.com',
      categoria: CategoriaConfiguracion.EMAIL,
      descripcion: 'Servidor SMTP para envío de emails',
      tipo: TipoConfiguracion.TEXTO,
      valorPorDefecto: 'localhost',
      esPublica: false,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    {
      id: 5,
      clave: 'SMTP_PORT',
      valor: '587',
      categoria: CategoriaConfiguracion.EMAIL,
      descripcion: 'Puerto del servidor SMTP',
      tipo: TipoConfiguracion.NUMERO,
      valorPorDefecto: '587',
      esPublica: false,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    {
      id: 6,
      clave: 'SMTP_USER',
      valor: 'sistema@empresa.com',
      categoria: CategoriaConfiguracion.EMAIL,
      descripcion: 'Usuario para autenticación SMTP',
      tipo: TipoConfiguracion.EMAIL,
      valorPorDefecto: '',
      esPublica: false,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    {
      id: 7,
      clave: 'SMTP_PASSWORD',
      valor: 'password123',
      categoria: CategoriaConfiguracion.EMAIL,
      descripcion: 'Contraseña para autenticación SMTP',
      tipo: TipoConfiguracion.PASSWORD,
      valorPorDefecto: '',
      esPublica: false,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    
    // Configuraciones de mapas
    {
      id: 8,
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
    },
    {
      id: 9,
      clave: 'MAPA_CENTRO_LAT',
      valor: '14.634915',
      categoria: CategoriaConfiguracion.MAPAS,
      descripcion: 'Latitud del centro del mapa por defecto',
      tipo: TipoConfiguracion.NUMERO,
      valorPorDefecto: '14.634915',
      esPublica: true,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    {
      id: 10,
      clave: 'MAPA_CENTRO_LNG',
      valor: '-90.506882',
      categoria: CategoriaConfiguracion.MAPAS,
      descripcion: 'Longitud del centro del mapa por defecto',
      tipo: TipoConfiguracion.NUMERO,
      valorPorDefecto: '-90.506882',
      esPublica: true,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    
    // Configuraciones de seguridad
    {
      id: 11,
      clave: 'SESSION_TIMEOUT',
      valor: '480',
      categoria: CategoriaConfiguracion.SEGURIDAD,
      descripcion: 'Tiempo de sesión en minutos',
      tipo: TipoConfiguracion.NUMERO,
      valorPorDefecto: '480',
      esPublica: false,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    {
      id: 12,
      clave: 'MAX_LOGIN_ATTEMPTS',
      valor: '3',
      categoria: CategoriaConfiguracion.SEGURIDAD,
      descripcion: 'Máximo número de intentos de login',
      tipo: TipoConfiguracion.NUMERO,
      valorPorDefecto: '3',
      esPublica: false,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    
    // Configuraciones de respaldos
    {
      id: 13,
      clave: 'BACKUP_ENABLED',
      valor: 'true',
      categoria: CategoriaConfiguracion.RESPALDOS,
      descripcion: 'Habilitar respaldos automáticos',
      tipo: TipoConfiguracion.BOOLEAN,
      valorPorDefecto: 'false',
      esPublica: false,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    },
    {
      id: 14,
      clave: 'BACKUP_FREQUENCY',
      valor: '24',
      categoria: CategoriaConfiguracion.RESPALDOS,
      descripcion: 'Frecuencia de respaldos en horas',
      tipo: TipoConfiguracion.NUMERO,
      valorPorDefecto: '24',
      esPublica: false,
      esEditable: true,
      fechaCreacion: new Date('2024-01-01'),
      fechaActualizacion: new Date('2024-01-01'),
      creadoPor: 1
    }
  ];

  // Datos mock de logs de auditoría
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
    },
    {
      id: 2,
      entidad: 'configuracion',
      idEntidad: 4,
      accion: AccionAuditoria.ACTUALIZAR,
      valorAnterior: 'smtp.old.com',
      valorNuevo: 'smtp.gmail.com',
      descripcion: 'Configuración SMTP_HOST actualizada',
      direccionIP: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      fechaCreacion: new Date('2024-10-21T09:15:00'),
      creadoPor: 1
    },
    {
      id: 3,
      entidad: 'cliente',
      idEntidad: 1,
      accion: AccionAuditoria.CREAR,
      descripcion: 'Cliente TechCorp Guatemala creado',
      direccionIP: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      fechaCreacion: new Date('2024-10-21T10:00:00'),
      creadoPor: 3
    },
    {
      id: 4,
      entidad: 'visita',
      idEntidad: 1,
      accion: AccionAuditoria.ACTUALIZAR,
      valorAnterior: 'PROGRAMADA',
      valorNuevo: 'EN_PROGRESO',
      descripcion: 'Visita iniciada por técnico',
      direccionIP: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      fechaCreacion: new Date('2024-10-21T11:30:00'),
      creadoPor: 4
    }
  ];

  private respaldos: RespaldoSistema[] = [
    {
      id: 1,
      tipo: TipoRespaldo.COMPLETO,
      descripcion: 'Respaldo completo automático diario',
      rutaArchivo: '/respaldos/backup_completo_2024-12-11.tar.gz',
      tamanoBytes: 15728640, // 15 MB
      archivos: [
        'database_dump.sql',
        'configuraciones.json',
        'usuarios.json',
        'clientes.json',
        'visitas.json',
        'logs/'
      ],
      estado: EstadoRespaldo.COMPLETADO,
      version: '1.0.0',
      fechaCreacion: new Date('2024-12-11T02:00:00'),
      fechaFinalizacion: new Date('2024-12-11T02:03:45'),
      duracionSegundos: 225,
      creadoPor: 1,
      comprimido: true
    },
    {
      id: 2,
      tipo: TipoRespaldo.CONFIGURACIONES,
      descripcion: 'Respaldo de configuraciones antes de actualización',
      rutaArchivo: '/respaldos/backup_config_2024-12-10.json',
      tamanoBytes: 2048576, // 2 MB
      archivos: [
        'configuraciones.json',
        'settings.json'
      ],
      estado: EstadoRespaldo.COMPLETADO,
      version: '1.0.0',
      fechaCreacion: new Date('2024-12-10T15:30:00'),
      fechaFinalizacion: new Date('2024-12-10T15:30:15'),
      duracionSegundos: 15,
      creadoPor: 1,
      comprimido: false
    },
    {
      id: 3,
      tipo: TipoRespaldo.USUARIOS,
      descripcion: 'Respaldo de usuarios antes de migración',
      rutaArchivo: '/respaldos/backup_usuarios_2024-12-09.sql',
      tamanoBytes: 5242880, // 5 MB
      archivos: [
        'usuarios.sql',
        'roles.sql',
        'permisos.sql'
      ],
      estado: EstadoRespaldo.COMPLETADO,
      version: '1.0.0',
      fechaCreacion: new Date('2024-12-09T10:15:00'),
      fechaFinalizacion: new Date('2024-12-09T10:15:45'),
      duracionSegundos: 45,
      creadoPor: 1,
      comprimido: true
    },
    {
      id: 4,
      tipo: TipoRespaldo.INCREMENTAL,
      descripcion: 'Respaldo incremental - cambios últimas 24h',
      rutaArchivo: '/respaldos/backup_incremental_2024-12-08.tar.gz',
      tamanoBytes: 1048576, // 1 MB
      archivos: [
        'cambios_configuraciones.json',
        'nuevas_visitas.json',
        'updates.log'
      ],
      estado: EstadoRespaldo.COMPLETADO,
      version: '1.0.0',
      fechaCreacion: new Date('2024-12-08T23:45:00'),
      fechaFinalizacion: new Date('2024-12-08T23:45:30'),
      duracionSegundos: 30,
      creadoPor: 1,
      comprimido: true
    },
    {
      id: 5,
      tipo: TipoRespaldo.COMPLETO,
      descripcion: 'Respaldo en progreso',
      rutaArchivo: '/respaldos/backup_en_progreso_2024-12-11.tar.gz',
      tamanoBytes: 0,
      archivos: [],
      estado: EstadoRespaldo.EN_PROGRESO,
      version: '1.0.0',
      fechaCreacion: new Date(),
      creadoPor: 1,
      comprimido: true
    }
  ];

  // Métodos CRUD para configuraciones
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
      creadoPor: 1, // Usuario actual
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
      modificadoPor: 1 // Usuario actual
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

  // Configuraciones específicas agrupadas
  getConfiguracionEmail(): Observable<any> {
    const emailConfigs = this.configuraciones.filter(c => c.categoria === CategoriaConfiguracion.EMAIL);
    const config = {
      smtpHost: emailConfigs.find(c => c.clave === 'SMTP_HOST')?.valor || '',
      smtpPort: parseInt(emailConfigs.find(c => c.clave === 'SMTP_PORT')?.valor || '587'),
      smtpUsuario: emailConfigs.find(c => c.clave === 'SMTP_USER')?.valor || '',
      smtpPassword: emailConfigs.find(c => c.clave === 'SMTP_PASSWORD')?.valor || '',
      smtpSeguro: true,
      emailRemitente: emailConfigs.find(c => c.clave === 'SMTP_USER')?.valor || '',
      nombreRemitente: 'Sistema Skynet'
    };
    return of(config).pipe(delay(300));
  }

  getConfiguracionMapas(): Observable<any> {
    const mapasConfigs = this.configuraciones.filter(c => c.categoria === CategoriaConfiguracion.MAPAS);
    const config = {
      googleMapsApiKey: mapasConfigs.find(c => c.clave === 'GOOGLE_MAPS_API_KEY')?.valor || '',
      centroLatitud: parseFloat(mapasConfigs.find(c => c.clave === 'MAPA_CENTRO_LAT')?.valor || '14.634915'),
      centroLongitud: parseFloat(mapasConfigs.find(c => c.clave === 'MAPA_CENTRO_LNG')?.valor || '-90.506882'),
      zoomPorDefecto: 12,
      mostrarTrafico: true,
      tipoMapa: 'roadmap'
    };
    return of(config).pipe(delay(300));
  }

  getConfiguracionRespaldos(): Observable<any> {
    const respaldosConfigs = this.configuraciones.filter(c => c.categoria === CategoriaConfiguracion.RESPALDOS);
    const config = {
      frecuenciaHoras: parseInt(respaldosConfigs.find(c => c.clave === 'BACKUP_FREQUENCY')?.valor || '24'),
      rutaRespaldos: '/var/backups/skynet',
      manenerDias: 30,
      incluirArchivos: true,
      emailNotificacion: 'admin@empresa.com',
      habilitado: respaldosConfigs.find(c => c.clave === 'BACKUP_ENABLED')?.valor === 'true'
    };
    return of(config).pipe(delay(300));
  }

  getConfiguracionSeguridad(): Observable<any> {
    const seguridadConfigs = this.configuraciones.filter(c => c.categoria === CategoriaConfiguracion.SEGURIDAD);
    const config = {
      tiempoSesionMinutos: parseInt(seguridadConfigs.find(c => c.clave === 'SESSION_TIMEOUT')?.valor || '480'),
      intentosLoginMaximo: parseInt(seguridadConfigs.find(c => c.clave === 'MAX_LOGIN_ATTEMPTS')?.valor || '3'),
      tiempoBloqueoMinutos: 15,
      longitudMinimaPassword: 8,
      requiereCaracteresEspeciales: true,
      requiereNumeros: true,
      requiereMayusculas: true,
      caducidadPasswordDias: 90
    };
    return of(config).pipe(delay(300));
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
    
    // Ordenar por fecha descendente
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
  ejecutarRespaldo(): Observable<any> {
    const resultado = {
      exito: true,
      mensaje: 'Respaldo ejecutado correctamente',
      archivo: `backup_${new Date().toISOString().slice(0, 10)}_${Date.now()}.sql`,
      tamaño: '2.5 MB',
      fecha: new Date()
    };
    return of(resultado).pipe(delay(2000)); // Simular tiempo de ejecución
  }

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
      creadoPor: 1, // Usuario actual
      comprimido: respaldoData.comprimido ?? true
    };

    this.respaldos.push(newRespaldo);

    // Simular finalización del respaldo después de un tiempo
    setTimeout(() => {
      const respaldo = this.respaldos.find(r => r.id === newRespaldo.id);
      if (respaldo) {
        respaldo.estado = EstadoRespaldo.COMPLETADO;
        respaldo.fechaFinalizacion = new Date();
        respaldo.duracionSegundos = Math.floor(Math.random() * 300) + 30; // 30-330 segundos
        respaldo.tamanoBytes = Math.floor(Math.random() * 20971520) + 1048576; // 1-21 MB
        
        // Simular archivos según el tipo
        switch (respaldo.tipo) {
          case TipoRespaldo.COMPLETO:
            respaldo.archivos = ['database_dump.sql', 'configuraciones.json', 'usuarios.json', 'clientes.json', 'visitas.json', 'logs/'];
            break;
          case TipoRespaldo.CONFIGURACIONES:
            respaldo.archivos = ['configuraciones.json', 'settings.json'];
            break;
          case TipoRespaldo.USUARIOS:
            respaldo.archivos = ['usuarios.sql', 'roles.sql', 'permisos.sql'];
            break;
          case TipoRespaldo.CLIENTES:
            respaldo.archivos = ['clientes.sql', 'direcciones.sql'];
            break;
          case TipoRespaldo.INCREMENTAL:
            respaldo.archivos = ['cambios.json', 'updates.log'];
            break;
        }
      }
    }, 5000); // 5 segundos para completar

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

    // Simular proceso de restauración
    const exito = Math.random() > 0.1; // 90% de éxito
    return of({
      exito,
      mensaje: exito 
        ? `Restauración completada exitosamente desde respaldo ${respaldo.tipo}`
        : 'Error durante la restauración. Verifique la integridad del archivo.'
    }).pipe(delay(3000)); // Simular tiempo de restauración
  }

  descargarRespaldo(id: number): Observable<Blob> {
    // Simular descarga de archivo
    const content = `-- Respaldo de base de datos ID: ${id}\n-- Fecha: ${new Date().toISOString()}\n-- Contenido simulado`;
    const blob = new Blob([content], { type: 'application/sql' });
    return of(blob).pipe(delay(1000));
  }

  // Pruebas de configuración
  probarConfiguracionEmail(): Observable<{ exito: boolean; mensaje: string }> {
    // Simular prueba de email
    const exito = Math.random() > 0.3; // 70% de éxito
    return of({
      exito,
      mensaje: exito ? 'Configuración de email válida. Email de prueba enviado.' : 'Error: No se pudo conectar al servidor SMTP.'
    }).pipe(delay(2000));
  }

  probarConfiguracionMapas(): Observable<{ exito: boolean; mensaje: string }> {
    // Simular prueba de Google Maps API
    const exito = Math.random() > 0.2; // 80% de éxito
    return of({
      exito,
      mensaje: exito ? 'API Key de Google Maps válida.' : 'Error: API Key inválida o sin permisos.'
    }).pipe(delay(1500));
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