import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Usuario, UsuarioFilter, RoleTipo } from '@core/interfaces';

@Component({
  selector: 'app-usuarios-list',
  standalone: false,
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">Gestión de Usuarios</h2>
              <p class="text-muted mb-0">Administrar usuarios del sistema</p>
            </div>
            <button 
              class="btn btn-primary"
              (click)="crearUsuario()">
              <i class="fas fa-plus me-2"></i>
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Buscar por nombre</label>
              <input 
                type="text" 
                class="form-control"
                placeholder="Nombre o apellido..."
                [(ngModel)]="filters.nombre"
                (input)="applyFilters()">
            </div>
            <div class="col-md-3">
              <label class="form-label">Filtrar por rol</label>
              <select 
                class="form-select"
                [(ngModel)]="filters.rol"
                (change)="applyFilters()">
                <option value="">Todos los roles</option>
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="TECNICO">Técnico</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Estado</label>
              <select 
                class="form-select"
                [(ngModel)]="filterStatus"
                (change)="applyStatusFilter()">
                <option value="">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button 
                class="btn btn-outline-secondary w-100"
                (click)="limpiarFiltros()">
                <i class="fas fa-eraser me-2"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de usuarios -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-users me-2"></i>
            Usuarios ({{ usuariosFiltrados.length }})
          </h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Supervisor</th>
                  <th>Estado</th>
                  <th>Último acceso</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let usuario of usuariosFiltrados; trackBy: trackByUsuario">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar-circle me-3">
                        {{ getInitials(usuario.nombre, usuario.apellido) }}
                      </div>
                      <div>
                        <div class="fw-semibold">{{ usuario.nombre }} {{ usuario.apellido }}</div>
                        <small class="text-muted">ID: {{ usuario.idUsuario }}</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ usuario.email }}</td>
                  <td>{{ usuario.telefono || 'No registrado' }}</td>
                  <td>
                    <span 
                      class="badge"
                      [class]="getRoleBadgeClass(usuario.rol)">
                      {{ getRoleLabel(usuario.rol) }}
                    </span>
                  </td>
                  <td>
                    <span *ngIf="usuario.idSupervisor; else noSupervisor">
                      {{ getSupervisorName(usuario.idSupervisor) }}
                    </span>
                    <ng-template #noSupervisor>
                      <span class="text-muted">-</span>
                    </ng-template>
                  </td>
                  <td>
                    <span 
                      class="badge"
                      [class]="usuario.activo ? 'bg-success' : 'bg-danger'">
                      {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td>
                    <small class="text-muted">
                      {{ formatDate(usuario.fechaActualizacion) }}
                    </small>
                  </td>
                  <td class="text-center">
                    <div class="btn-group btn-group-sm">
                      <button 
                        class="btn btn-outline-primary"
                        (click)="verUsuario(usuario.idUsuario)"
                        title="Ver detalles">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-outline-warning"
                        (click)="editarUsuario(usuario.idUsuario)"
                        title="Editar">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="btn"
                        [class]="usuario.activo ? 'btn-outline-danger' : 'btn-outline-success'"
                        (click)="toggleUsuarioStatus(usuario)"
                        [title]="usuario.activo ? 'Desactivar' : 'Activar'">
                        <i [class]="usuario.activo ? 'fas fa-ban' : 'fas fa-check'"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div *ngIf="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && usuariosFiltrados.length === 0" class="text-center py-5">
        <i class="fas fa-users fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No se encontraron usuarios</h5>
        <p class="text-muted">Intenta ajustar los filtros o crear un nuevo usuario</p>
      </div>
    </div>

    <!-- Modal de Usuario -->
    <app-usuario-detail
      [show]="showModal"
      [usuarioId]="selectedUsuarioId"
      [mode]="modalMode"
      (closed)="onModalClosed()"
      (userUpdated)="onUserUpdated($event)">
    </app-usuario-detail>
  `,
  styles: [`
    .avatar-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
    }
    
    .table th {
      font-weight: 600;
      border-bottom: 2px solid #dee2e6;
    }
    
    .btn-group-sm .btn {
      padding: 0.25rem 0.5rem;
    }
    
    .badge {
      font-size: 0.75em;
    }
  `]
})
export class UsuariosListComponent implements OnInit {
  
  private usuariosService = inject(UsuariosService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  loading = false;
  
  filters: UsuarioFilter = {};
  filterStatus: string = '';

  // Modal properties
  showModal = false;
  selectedUsuarioId: number | null = null;
  modalMode: 'view' | 'edit' | 'toggle' = 'view';

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuariosService.getAll().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = [...usuarios];
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al cargar usuarios');
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  applyFilters(): void {
    this.loading = true;
    this.usuariosService.getAll(this.filters).subscribe({
      next: (usuarios) => {
        this.usuariosFiltrados = usuarios;
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al filtrar usuarios');
        this.loading = false;
      }
    });
  }

  applyStatusFilter(): void {
    if (this.filterStatus !== '') {
      this.filters.activo = this.filterStatus === 'true';
    } else {
      delete this.filters.activo;
    }
    this.applyFilters();
  }

  limpiarFiltros(): void {
    this.filters = {};
    this.filterStatus = '';
    this.usuariosFiltrados = [...this.usuarios];
  }

  crearUsuario(): void {
    this.router.navigate(['/dashboard/usuarios/nuevo']);
  }

  verUsuario(id: number): void {
    console.log('Abriendo modal para ver usuario con ID:', id);
    this.selectedUsuarioId = id;
    this.modalMode = 'view';
    this.showModal = true;
  }

  editarUsuario(id: number): void {
    console.log('Abriendo modal para editar usuario con ID:', id);
    this.selectedUsuarioId = id;
    this.modalMode = 'edit';
    this.showModal = true;
  }

  toggleUsuarioStatus(usuario: Usuario): void {
    // Abrir modal en modo toggle para confirmar la acción
    console.log('Abriendo modal para toggle usuario:', usuario.idUsuario, 'Estado actual:', usuario.activo);
    this.selectedUsuarioId = usuario.idUsuario;
    this.modalMode = 'toggle';
    this.showModal = true;
  }

  onModalClosed(): void {
    this.showModal = false;
    this.selectedUsuarioId = null;
    this.modalMode = 'view';
  }

  onUserUpdated(updatedUser: Usuario): void {
    const index = this.usuarios.findIndex(u => u.idUsuario === updatedUser.idUsuario);
    if (index !== -1) {
      this.usuarios[index] = updatedUser;
      this.applyFilters(); // Refresh filtered list
    }
  }

  // Utility methods
  trackByUsuario(index: number, usuario: Usuario): number {
    return usuario.idUsuario;
  }

  getInitials(nombre: string, apellido: string): string {
    return (nombre.charAt(0) + apellido.charAt(0)).toUpperCase();
  }

  getRoleLabel(rol: RoleTipo): string {
    const labels = {
      'ADMINISTRADOR': 'Administrador',
      'SUPERVISOR': 'Supervisor',
      'TECNICO': 'Técnico'
    };
    return labels[rol] || rol;
  }

  getRoleBadgeClass(rol: RoleTipo): string {
    const classes = {
      'ADMINISTRADOR': 'bg-danger',
      'SUPERVISOR': 'bg-warning text-dark',
      'TECNICO': 'bg-info'
    };
    return classes[rol] || 'bg-secondary';
  }

  getSupervisorName(supervisorId: number): string {
    const supervisor = this.usuarios.find(u => u.idUsuario === supervisorId);
    return supervisor ? `${supervisor.nombre} ${supervisor.apellido}` : 'No encontrado';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}