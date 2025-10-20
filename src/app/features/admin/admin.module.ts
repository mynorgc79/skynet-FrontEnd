import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';

// Components
import { DashboardLayoutComponent } from './pages/dashboard-layout.component';
import { DashboardComponent } from './pages/dashboard.component';

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
