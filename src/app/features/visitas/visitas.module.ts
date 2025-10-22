import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VisitasRoutingModule } from './visitas-routing.module';
import { VisitasListComponent } from './pages/visitas-list.component';

@NgModule({
  declarations: [
    VisitasListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VisitasRoutingModule
  ]
})
export class VisitasModule { }