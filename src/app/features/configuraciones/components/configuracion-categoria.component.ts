import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ConfiguracionService } from '../../../core/services/configuracion.service';
import { ToastService } from '../../../shared/services/toast.service';
import { 
  Configuracion, 
  CategoriaConfiguracion, 
  TipoConfiguracion,
  ConfiguracionCreateDTO,
  ConfiguracionUpdateDTO
} from '@core/interfaces';

@Component({
  selector: 'app-configuracion-categoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">
                <i [class]="categoriaInfo?.icono + ' me-2'"></i>
                {{ categoriaInfo?.nombre }}
              </h2>
              <p class="text-muted mb-0">{{ categoriaInfo?.descripcion }}</p>
            </div>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-primary"
                (click)="nuevaConfiguracion()">
                <i class="fas fa-plus me-2"></i>
                Nueva Configuración
              </button>
              <button 
                class="btn btn-outline-secondary"
                (click)="volver()">
                <i class="fas fa-arrow-left me-2"></i>
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Buscar</label>
              <input 
                type="text" 
                class="form-control"
                [(ngModel)]="filtros.buscar"
                (input)="aplicarFiltros()"
                placeholder="Buscar por clave o descripción">
            </div>
            <div class="col-md-2">
              <label class="form-label">Públicas</label>
              <select 
                class="form-select"
                [(ngModel)]="filtros.esPublica"
                (change)="aplicarFiltros()">
                <option value="">Todas</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Editables</label>
              <select 
                class="form-select"
                [(ngModel)]="filtros.esEditable"
                (change)="aplicarFiltros()">
                <option value="">Todas</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
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

      <!-- Lista de configuraciones -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-list me-2"></i>
            Configuraciones ({{ configuracionesFiltradas.length }})
          </h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Clave</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let config of configuracionesFiltradas; trackBy: trackByConfig">
                  <td>
                    <code class="text-primary">{{ config.clave }}</code>
                  </td>
                  <td>
                    <div *ngIf="!config.editando">
                      <span [innerHTML]="formatearValor(config)"></span>
                    </div>
                    <div *ngIf="config.editando" class="d-flex gap-2">
                      <input 
                        *ngIf="config.tipo !== 'BOOLEAN'"
                        type="text" 
                        class="form-control form-control-sm"
                        [(ngModel)]="config.nuevoValor"
                        [type]="getInputType(config.tipo)">
                      <select 
                        *ngIf="config.tipo === 'BOOLEAN'"
                        class="form-select form-select-sm"
                        [(ngModel)]="config.nuevoValor">
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                      <button 
                        class="btn btn-success btn-sm"
                        (click)="guardarConfiguracion(config)">
                        <i class="fas fa-check"></i>
                      </button>
                      <button 
                        class="btn btn-secondary btn-sm"
                        (click)="cancelarEdicion(config)">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [class]="'bg-' + getTipoColor(config.tipo)">
                      {{ getTipoLabel(config.tipo) }}
                    </span>
                  </td>
                  <td>
                    <small>{{ config.descripcion || '-' }}</small>
                  </td>
                  <td>
                    <div class="d-flex gap-1">
                      <span 
                        *ngIf="config.esPublica" 
                        class="badge bg-info" 
                        title="Pública">
                        <i class="fas fa-eye"></i>
                      </span>
                      <span 
                        *ngIf="config.esEditable" 
                        class="badge bg-success" 
                        title="Editable">
                        <i class="fas fa-edit"></i>
                      </span>
                      <span 
                        *ngIf="!config.esEditable" 
                        class="badge bg-secondary" 
                        title="Solo lectura">
                        <i class="fas fa-lock"></i>
                      </span>
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="btn-group btn-group-sm">
                      <button 
                        *ngIf="!config.editando && config.esEditable"
                        class="btn btn-outline-primary"
                        (click)="editarConfiguracion(config)"
                        title="Editar">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="btn btn-outline-info"
                        (click)="verHistorial(config)"
                        title="Ver historial">
                        <i class="fas fa-history"></i>
                      </button>
                      <button 
                        *ngIf="config.esEditable"
                        class="btn btn-outline-danger"
                        (click)="eliminarConfiguracion(config)"
                        title="Eliminar">
                        <i class="fas fa-trash"></i>
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
      <div *ngIf="!loading && configuracionesFiltradas.length === 0" class="text-center py-5">
        <i class="fas fa-cogs fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No se encontraron configuraciones</h5>
        <p class="text-muted">Intenta ajustar los filtros o crea una nueva configuración</p>
      </div>
    </div>

    <!-- Modal para nueva configuración -->
    <div class="modal fade" id="modalNuevaConfiguracion" tabindex="-1" *ngIf="mostrarModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nueva Configuración</h5>
            <button type="button" class="btn-close" (click)="cerrarModal()"></button>
          </div>
          <form [formGroup]="configForm" (ngSubmit)="crearConfiguracion()">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Clave *</label>
                <input 
                  type="text" 
                  class="form-control"
                  formControlName="clave"
                  placeholder="NOMBRE_CONFIGURACION">
                <div class="form-text">Nombre único para la configuración (MAYÚSCULAS_CON_GUIONES)</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Tipo *</label>
                <select class="form-select" formControlName="tipo">
                  <option value="">Seleccionar tipo</option>
                  <option value="TEXTO">Texto</option>
                  <option value="NUMERO">Número</option>
                  <option value="BOOLEAN">Booleano</option>
                  <option value="EMAIL">Email</option>
                  <option value="URL">URL</option>
                  <option value="PASSWORD">Contraseña</option>
                  <option value="JSON">JSON</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Valor *</label>
                <input 
                  type="text" 
                  class="form-control"
                  formControlName="valor"
                  placeholder="Valor de la configuración">
              </div>
              <div class="mb-3">
                <label class="form-label">Valor por defecto *</label>
                <input 
                  type="text" 
                  class="form-control"
                  formControlName="valorPorDefecto"
                  placeholder="Valor inicial/por defecto">
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  formControlName="descripcion"
                  placeholder="Descripción de la configuración"></textarea>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      formControlName="esPublica">
                    <label class="form-check-label">Es pública</label>
                    <div class="form-text">Visible para usuarios no administradores</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      formControlName="esEditable">
                    <label class="form-check-label">Es editable</label>
                    <div class="form-text">Puede ser modificada</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="cerrarModal()">
                Cancelar
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="configForm.invalid || creando">
                <span *ngIf="creando" class="spinner-border spinner-border-sm me-2"></span>
                {{ creando ? 'Creando...' : 'Crear Configuración' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
    
    code {
      background-color: #f8f9fa;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
    }
    
    .modal {
      display: block;
      background-color: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class ConfiguracionCategoriaComponent implements OnInit {
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private configuracionService = inject(ConfiguracionService);
  private toastService = inject(ToastService);

  categoria: CategoriaConfiguracion | null = null;
  categoriaInfo: any = null;
  configuraciones: (Configuracion & { editando?: boolean; nuevoValor?: string })[] = [];
  configuracionesFiltradas: (Configuracion & { editando?: boolean; nuevoValor?: string })[] = [];
  loading = false;
  mostrarModal = false;
  creando = false;

  filtros = {
    buscar: '',
    esPublica: '',
    esEditable: ''
  };

  configForm: FormGroup;

  constructor() {
    this.configForm = this.fb.group({
      clave: ['', [Validators.required, Validators.pattern(/^[A-Z_]+$/)]],
      tipo: ['', Validators.required],
      valor: ['', Validators.required],
      valorPorDefecto: ['', Validators.required],
      descripcion: [''],
      esPublica: [false],
      esEditable: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoria = params['categoria'] as CategoriaConfiguracion;
      if (this.categoria) {
        this.categoriaInfo = this.configuracionService.getCategoriaInfo(this.categoria);
        this.cargarConfiguraciones();
      }
    });
  }

  cargarConfiguraciones(): void {
    if (!this.categoria) return;
    
    this.loading = true;
    this.configuracionService.getPorCategoria(this.categoria).subscribe({
      next: (configuraciones) => {
        this.configuraciones = configuraciones.map(config => ({
          ...config,
          editando: false,
          nuevoValor: config.valor
        }));
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Error al cargar configuraciones');
        this.loading = false;
        console.error('Error loading configurations:', error);
      }
    });
  }

  aplicarFiltros(): void {
    let filtradas = [...this.configuraciones];
    
    if (this.filtros.buscar) {
      const buscar = this.filtros.buscar.toLowerCase();
      filtradas = filtradas.filter(config => 
        config.clave.toLowerCase().includes(buscar) ||
        config.descripcion?.toLowerCase().includes(buscar) ||
        config.valor.toLowerCase().includes(buscar)
      );
    }
    
    if (this.filtros.esPublica !== '') {
      filtradas = filtradas.filter(config => 
        config.esPublica === (this.filtros.esPublica === 'true')
      );
    }
    
    if (this.filtros.esEditable !== '') {
      filtradas = filtradas.filter(config => 
        config.esEditable === (this.filtros.esEditable === 'true')
      );
    }
    
    this.configuracionesFiltradas = filtradas;
  }

  limpiarFiltros(): void {
    this.filtros = {
      buscar: '',
      esPublica: '',
      esEditable: ''
    };
    this.aplicarFiltros();
  }

  editarConfiguracion(config: Configuracion & { editando?: boolean; nuevoValor?: string }): void {
    config.editando = true;
    config.nuevoValor = config.valor;
  }

  cancelarEdicion(config: Configuracion & { editando?: boolean; nuevoValor?: string }): void {
    config.editando = false;
    config.nuevoValor = config.valor;
  }

  guardarConfiguracion(config: Configuracion & { editando?: boolean; nuevoValor?: string }): void {
    if (!config.nuevoValor) return;
    
    // Validar valor
    const validacion = this.configuracionService.validarValor(config.tipo, config.nuevoValor);
    if (!validacion.valido) {
      this.toastService.showError(validacion.mensaje || 'Valor inválido');
      return;
    }
    
    const updateData: ConfiguracionUpdateDTO = {
      valor: config.nuevoValor
    };
    
    this.configuracionService.update(config.id, updateData).subscribe({
      next: (configActualizada) => {
        config.valor = configActualizada.valor!;
        config.editando = false;
        this.toastService.showSuccess('Configuración actualizada correctamente');
      },
      error: (error) => {
        this.toastService.showError('Error al actualizar configuración');
        console.error('Error updating configuration:', error);
      }
    });
  }

  eliminarConfiguracion(config: Configuracion): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la configuración "${config.clave}"?`)) {
      this.configuracionService.delete(config.id).subscribe({
        next: () => {
          this.configuraciones = this.configuraciones.filter(c => c.id !== config.id);
          this.aplicarFiltros();
          this.toastService.showSuccess('Configuración eliminada correctamente');
        },
        error: (error) => {
          this.toastService.showError('Error al eliminar configuración');
          console.error('Error deleting configuration:', error);
        }
      });
    }
  }

  nuevaConfiguracion(): void {
    this.configForm.patchValue({
      categoria: this.categoria
    });
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.configForm.reset();
  }

  crearConfiguracion(): void {
    if (this.configForm.invalid) return;
    
    this.creando = true;
    const configData: ConfiguracionCreateDTO = {
      ...this.configForm.value,
      categoria: this.categoria
    };
    
    this.configuracionService.create(configData).subscribe({
      next: (nuevaConfig) => {
        this.configuraciones.push({
          ...nuevaConfig,
          editando: false,
          nuevoValor: nuevaConfig.valor
        });
        this.aplicarFiltros();
        this.cerrarModal();
        this.creando = false;
        this.toastService.showSuccess('Configuración creada correctamente');
      },
      error: (error) => {
        this.toastService.showError('Error al crear configuración');
        this.creando = false;
        console.error('Error creating configuration:', error);
      }
    });
  }

  verHistorial(config: Configuracion): void {
    // Navegar a vista de historial de la configuración
    this.router.navigate(['/dashboard/configuraciones/logs'], {
      queryParams: { entidad: 'configuracion', idEntidad: config.id }
    });
  }

  volver(): void {
    this.router.navigate(['/dashboard/configuraciones']);
  }

  // Utility methods
  trackByConfig(index: number, config: Configuracion): number {
    return config.id;
  }

  formatearValor(config: Configuracion): string {
    return this.configuracionService.formatearValor(config.tipo, config.valor);
  }

  getTipoLabel(tipo: TipoConfiguracion): string {
    const labels = {
      'TEXTO': 'Texto',
      'NUMERO': 'Número',
      'BOOLEAN': 'Booleano',
      'EMAIL': 'Email',
      'URL': 'URL',
      'PASSWORD': 'Contraseña',
      'JSON': 'JSON'
    };
    return labels[tipo] || tipo;
  }

  getTipoColor(tipo: TipoConfiguracion): string {
    const colors = {
      'TEXTO': 'secondary',
      'NUMERO': 'primary',
      'BOOLEAN': 'success',
      'EMAIL': 'info',
      'URL': 'warning',
      'PASSWORD': 'danger',
      'JSON': 'dark'
    };
    return colors[tipo] || 'secondary';
  }

  getInputType(tipo: TipoConfiguracion): string {
    const types: Record<TipoConfiguracion, string> = {
      [TipoConfiguracion.NUMERO]: 'number',
      [TipoConfiguracion.EMAIL]: 'email',
      [TipoConfiguracion.URL]: 'url',
      [TipoConfiguracion.PASSWORD]: 'password',
      [TipoConfiguracion.TEXTO]: 'text',
      [TipoConfiguracion.BOOLEAN]: 'text',
      [TipoConfiguracion.JSON]: 'text'
    };
    return types[tipo] || 'text';
  }
}