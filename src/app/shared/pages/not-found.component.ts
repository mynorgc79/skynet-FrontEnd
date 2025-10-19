import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container text-center mt-5">
      <h1 class="display-1">404</h1>
      <h2>Página no encontrada</h2>
      <p class="lead">La página que buscas no existe.</p>
      <a routerLink="/" class="btn btn-primary">Volver al inicio</a>
    </div>
  `,
  styles: [`
    .container {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  `]
})
export class NotFoundComponent { }