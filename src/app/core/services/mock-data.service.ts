import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario, Cliente, Visita, Ejecucion, UsuarioFilter, UsuarioCreateDTO, UsuarioUpdateDTO, RoleTipo, ClienteFilter, ClienteCreateDTO, ClienteUpdateDTO } from '../interfaces';

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
      fechaVisita: new Date('2024-10-19T09:00:00'),
      motivo: 'Mantenimiento preventivo de equipos',
      estado: 'COMPLETADA'
    },
    {
      idVisita: 2,
      idCliente: 2,
      idSupervisor: 2,
      idTecnico: 4,
      fechaVisita: new Date('2024-10-19T11:00:00'),
      motivo: 'Instalación de nuevo servidor',
      estado: 'EN_PROGRESO'
    },
    {
      idVisita: 3,
      idCliente: 3,
      idSupervisor: 2,
      idTecnico: 3,
      fechaVisita: new Date('2024-10-19T14:00:00'),
      motivo: 'Soporte técnico urgente',
      estado: 'PROGRAMADA'
    },
    {
      idVisita: 4,
      idCliente: 4,
      idSupervisor: 2,
      idTecnico: 5,
      fechaVisita: new Date('2024-10-19T16:00:00'),
      motivo: 'Actualización de software',
      estado: 'PROGRAMADA'
    },
    {
      idVisita: 5,
      idCliente: 1,
      idSupervisor: 2,
      idTecnico: 4,
      fechaVisita: new Date('2024-10-20T10:00:00'),
      motivo: 'Revisión mensual',
      estado: 'PROGRAMADA'
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
}