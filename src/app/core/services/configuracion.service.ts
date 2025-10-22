import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { MockDataService } from './mock-data.service';
import { 
  Configuracion, 
  ConfiguracionCreateDTO, 
  ConfiguracionUpdateDTO, 
  ConfiguracionFilter,
  CategoriaConfiguracion,
  TipoConfiguracion,
  ConfiguracionesPorCategoria,
  LogAuditoria,
  LogAuditoriaFilter,
  AccionAuditoria,
  RespaldoSistema,
  RespaldoCreateDTO,
  RespaldoFilter,
  TipoRespaldo,
  EstadoRespaldo
} from '@core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(private mockDataService: MockDataService) { }

  // Métodos CRUD para configuraciones
  getAll(filters?: ConfiguracionFilter): Observable<Configuracion[]> {
    return this.mockDataService.getConfiguraciones(filters);
  }

  getById(id: number): Observable<Configuracion> {
    return this.mockDataService.getConfiguracionById(id);
  }

  create(configuracion: ConfiguracionCreateDTO): Observable<Configuracion> {
    return this.mockDataService.createConfiguracion(configuracion);
  }

  update(id: number, configuracion: ConfiguracionUpdateDTO): Observable<Configuracion> {
    return this.mockDataService.updateConfiguracion(id, configuracion);
  }

  delete(id: number): Observable<void> {
    return this.mockDataService.deleteConfiguracion(id);
  }

  // Métodos específicos
  getPorCategoria(categoria: CategoriaConfiguracion): Observable<Configuracion[]> {
    return this.getAll({ categoria });
  }

  getConfiguracionesPorCategoria(): Observable<ConfiguracionesPorCategoria[]> {
    return this.mockDataService.getConfiguracionesPorCategoria();
  }

  getValor(clave: string): Observable<string | null> {
    return this.mockDataService.getConfiguracionValor(clave);
  }

  setValor(clave: string, valor: string): Observable<void> {
    return this.mockDataService.setConfiguracionValor(clave, valor);
  }

  // Configuraciones específicas del sistema
  getConfiguracionEmail(): Observable<any> {
    return this.mockDataService.getConfiguracionEmail();
  }

  getConfiguracionMapas(): Observable<any> {
    return this.mockDataService.getConfiguracionMapas();
  }

  getConfiguracionRespaldos(): Observable<any> {
    return this.mockDataService.getConfiguracionRespaldos();
  }

  getConfiguracionSeguridad(): Observable<any> {
    return this.mockDataService.getConfiguracionSeguridad();
  }

  // Logs de auditoría
  getLogsAuditoria(filters?: LogAuditoriaFilter): Observable<LogAuditoria[]> {
    return this.mockDataService.getLogsAuditoria(filters);
  }

  createLogAuditoria(log: Partial<LogAuditoria>): Observable<LogAuditoria> {
    return this.mockDataService.createLogAuditoria(log);
  }

  // Operaciones de respaldo
  getRespaldos(filters?: RespaldoFilter): Observable<RespaldoSistema[]> {
    return this.mockDataService.getRespaldos(filters);
  }

  crearRespaldo(respaldo: RespaldoCreateDTO): Observable<RespaldoSistema> {
    return this.mockDataService.crearRespaldo(respaldo);
  }

  eliminarRespaldo(id: number): Observable<void> {
    return this.mockDataService.eliminarRespaldo(id);
  }

  descargarRespaldo(id: number): Observable<Blob> {
    return this.mockDataService.descargarRespaldo(id);
  }

  restaurarRespaldo(id: number): Observable<{ exito: boolean; mensaje: string }> {
    return this.mockDataService.restaurarRespaldo(id);
  }

  // Operaciones de respaldo legacy (mantener compatibilidad)
  ejecutarRespaldo(): Observable<any> {
    return this.mockDataService.ejecutarRespaldo();
  }

  // Pruebas de configuración
  probarConfiguracionEmail(): Observable<{ exito: boolean; mensaje: string }> {
    return this.mockDataService.probarConfiguracionEmail();
  }

  probarConfiguracionMapas(): Observable<{ exito: boolean; mensaje: string }> {
    return this.mockDataService.probarConfiguracionMapas();
  }

  // Utilidades
  getCategorias(): CategoriaConfiguracion[] {
    return Object.values(CategoriaConfiguracion);
  }

  getTipos(): TipoConfiguracion[] {
    return Object.values(TipoConfiguracion);
  }

  getCategoriaInfo(categoria: CategoriaConfiguracion): { nombre: string; descripcion: string; icono: string } {
    const info = {
      [CategoriaConfiguracion.GENERAL]: {
        nombre: 'General',
        descripcion: 'Configuraciones generales del sistema',
        icono: 'fas fa-cogs'
      },
      [CategoriaConfiguracion.EMAIL]: {
        nombre: 'Email',
        descripcion: 'Configuraciones de correo electrónico y SMTP',
        icono: 'fas fa-envelope'
      },
      [CategoriaConfiguracion.MAPAS]: {
        nombre: 'Mapas',
        descripcion: 'Configuraciones de Google Maps y geolocalización',
        icono: 'fas fa-map'
      },
      [CategoriaConfiguracion.RESPALDOS]: {
        nombre: 'Respaldos',
        descripcion: 'Configuraciones de respaldos automáticos',
        icono: 'fas fa-database'
      },
      [CategoriaConfiguracion.SEGURIDAD]: {
        nombre: 'Seguridad',
        descripcion: 'Configuraciones de seguridad y autenticación',
        icono: 'fas fa-shield-alt'
      },
      [CategoriaConfiguracion.NOTIFICACIONES]: {
        nombre: 'Notificaciones',
        descripcion: 'Configuraciones de notificaciones del sistema',
        icono: 'fas fa-bell'
      }
    };

    return info[categoria];
  }

  validarValor(tipo: TipoConfiguracion, valor: string): { valido: boolean; mensaje?: string } {
    switch (tipo) {
      case TipoConfiguracion.EMAIL:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
          valido: emailRegex.test(valor),
          mensaje: !emailRegex.test(valor) ? 'Formato de email inválido' : undefined
        };
      
      case TipoConfiguracion.URL:
        try {
          new URL(valor);
          return { valido: true };
        } catch {
          return { valido: false, mensaje: 'URL inválida' };
        }
      
      case TipoConfiguracion.NUMERO:
        const numero = Number(valor);
        return {
          valido: !isNaN(numero),
          mensaje: isNaN(numero) ? 'Debe ser un número válido' : undefined
        };
      
      case TipoConfiguracion.BOOLEAN:
        const valoresValidos = ['true', 'false', '1', '0', 'yes', 'no', 'si', 'no'];
        return {
          valido: valoresValidos.includes(valor.toLowerCase()),
          mensaje: !valoresValidos.includes(valor.toLowerCase()) ? 'Debe ser true/false o si/no' : undefined
        };
      
      case TipoConfiguracion.JSON:
        try {
          JSON.parse(valor);
          return { valido: true };
        } catch {
          return { valido: false, mensaje: 'JSON inválido' };
        }
      
      default:
        return { valido: true };
    }
  }

  formatearValor(tipo: TipoConfiguracion, valor: string): string {
    switch (tipo) {
      case TipoConfiguracion.BOOLEAN:
        const boolValue = ['true', '1', 'yes', 'si'].includes(valor.toLowerCase());
        return boolValue ? 'Sí' : 'No';
      
      case TipoConfiguracion.PASSWORD:
        return '*'.repeat(valor.length);
      
      case TipoConfiguracion.JSON:
        try {
          return JSON.stringify(JSON.parse(valor), null, 2);
        } catch {
          return valor;
        }
      
      default:
        return valor;
    }
  }
}