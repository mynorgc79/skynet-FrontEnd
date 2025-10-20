import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario, Cliente, Visita, Ejecucion, UsuarioFilter, UsuarioCreateDTO, UsuarioUpdateDTO, RoleTipo } from '../interfaces';

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
      nombre: 'Empresa',
      apellido: 'ABC S.A.',
      correo: 'contacto@empresaabc.com',
      email: 'contacto@empresaabc.com',
      coordenadasMaps: '14.6084,-90.5253',
      latitud: 14.6084,
      longitud: -90.5253
    },
    {
      idCliente: 2,
      nombre: 'Tech',
      apellido: 'Solutions Ltd.',
      correo: 'info@techsolutions.com',
      email: 'info@techsolutions.com',
      coordenadasMaps: '14.6180,-90.5130',
      latitud: 14.6180,
      longitud: -90.5130
    },
    {
      idCliente: 3,
      nombre: 'Global',
      apellido: 'Corp Inc.',
      correo: 'admin@globalcorp.com',
      email: 'admin@globalcorp.com',
      coordenadasMaps: '14.6200,-90.5300',
      latitud: 14.6200,
      longitud: -90.5300
    },
    {
      idCliente: 4,
      nombre: 'Innovate',
      apellido: 'Systems',
      correo: 'contact@innovatesys.com',
      email: 'contact@innovatesys.com',
      coordenadasMaps: '14.6150,-90.5200',
      latitud: 14.6150,
      longitud: -90.5200
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
}