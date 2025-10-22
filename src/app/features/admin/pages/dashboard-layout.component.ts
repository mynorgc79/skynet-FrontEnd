import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/interfaces';

@Component({
  selector: 'app-dashboard-layout',
  standalone: false,
  template: `
    <div class="d-flex" id="wrapper">
      <!-- Sidebar -->
      <div class="bg-dark border-end" id="sidebar-wrapper">
        <div class="sidebar-heading bg-primary text-white p-3">
          <h5 class="mb-0">Skynet System</h5>
        </div>
        <div class="list-group list-group-flush">
          <a 
            *ngFor="let item of menuItems" 
            [routerLink]="item.route"
            routerLinkActive="active"
            class="list-group-item list-group-item-action bg-dark text-white border-0">
            <i [class]="item.icon + ' me-2'"></i>
            {{ item.label }}
          </a>
        </div>
      </div>
      
      <!-- Page Content -->
      <div id="page-content-wrapper" class="flex-grow-1">
        <!-- Top Navigation -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
          <div class="container-fluid">
            <button 
              class="btn btn-outline-dark" 
              (click)="toggleSidebar()"
              type="button">
              <i class="fas fa-bars"></i>
            </button>
            
            <div class="navbar-nav ms-auto">
              <div class="nav-item dropdown">
                <a 
                  class="nav-link dropdown-toggle d-flex align-items-center" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown">
                  <i class="fas fa-user-circle me-2"></i>
                  {{ currentUser?.nombre }} {{ currentUser?.apellido }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>Perfil</a></li>
                  <li><a class="dropdown-item" href="#"><i class="fas fa-cog me-2"></i>Configuraciones</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" (click)="logout()" href="#"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        
        <!-- Page Content -->
        <div class="container-fluid p-4">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    #wrapper {
      min-height: 100vh;
    }
    
    #sidebar-wrapper {
      min-width: 250px;
      transition: margin 0.25s ease-out;
    }
    
    #sidebar-wrapper.toggled {
      margin-left: -250px;
    }
    
    .list-group-item:hover {
      background-color: #495057 !important;
    }
    
    .list-group-item.active {
      background-color: #007bff !important;
      border-color: #007bff !important;
    }
    
    @media (max-width: 768px) {
      #sidebar-wrapper {
        margin-left: -250px;
      }
      
      #sidebar-wrapper.toggled {
        margin-left: 0;
      }
    }
  `]
})
export class DashboardLayoutComponent implements OnInit {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  menuItems: any[] = [];
  currentUser: Usuario | null = null;
  userRole: string = '';
  sidebarToggled = false;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userRole = this.authService.getCurrentUserRole() || '';
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    const baseMenuItems = [
      { label: 'Dashboard', route: '/dashboard', icon: 'fas fa-tachometer-alt', roles: ['ADMINISTRADOR', 'SUPERVISOR', 'TECNICO'] }
    ];

    // Menú específico por rol
    switch (this.userRole) {
      case 'ADMINISTRADOR':
        this.menuItems = [
          ...baseMenuItems,
          { label: 'Usuarios', route: '/dashboard/usuarios', icon: 'fas fa-users', roles: ['ADMINISTRADOR'] },
          { label: 'Clientes', route: '/dashboard/clientes', icon: 'fas fa-building', roles: ['ADMINISTRADOR', 'SUPERVISOR'] },
          { label: 'Visitas', route: '/dashboard/visitas', icon: 'fas fa-calendar-check', roles: ['ADMINISTRADOR', 'SUPERVISOR', 'TECNICO'] },
          { label: 'Reportes', route: '/dashboard/reportes', icon: 'fas fa-chart-bar', roles: ['ADMINISTRADOR', 'SUPERVISOR'] },
          { label: 'Configuraciones', route: '/dashboard/configuraciones', icon: 'fas fa-cogs', roles: ['ADMINISTRADOR'] }
        ];
        break;
        
      case 'SUPERVISOR':
        this.menuItems = [
          ...baseMenuItems,
          { label: 'Mi Equipo', route: '/dashboard/equipo', icon: 'fas fa-users', roles: ['SUPERVISOR'] },
          { label: 'Clientes', route: '/dashboard/clientes', icon: 'fas fa-building', roles: ['SUPERVISOR'] },
          { label: 'Visitas', route: '/dashboard/visitas', icon: 'fas fa-calendar-check', roles: ['SUPERVISOR'] },
          { label: 'Reportes', route: '/dashboard/reportes', icon: 'fas fa-chart-bar', roles: ['SUPERVISOR'] }
        ];
        break;
        
      case 'TECNICO':
        this.menuItems = [
          ...baseMenuItems,
          { label: 'Mis Visitas', route: '/dashboard/visitas', icon: 'fas fa-calendar-day', roles: ['TECNICO'] },
          { label: 'Clientes', route: '/dashboard/clientes', icon: 'fas fa-building', roles: ['TECNICO'] },
          { label: 'Mi Perfil', route: '/dashboard/perfil', icon: 'fas fa-user', roles: ['TECNICO'] }
        ];
        break;
        
      default:
        this.menuItems = baseMenuItems;
    }
  }

  toggleSidebar(): void {
    this.sidebarToggled = !this.sidebarToggled;
    const wrapper = document.getElementById('sidebar-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('toggled');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}