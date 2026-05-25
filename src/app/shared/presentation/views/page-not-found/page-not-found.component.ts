import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Parece que te has perdido en el campo. La ruta que buscas no existe.</p>
      <a routerLink="/" class="back-btn">Volver al inicio</a>
    </div>
  `,
  styles: [`
    .not-found-container { text-align: center; padding: 4rem 2rem; }
    h1 { font-size: 6rem; color: #2e7d32; margin: 0; }
    .back-btn { display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #2e7d32; color: white; text-decoration: none; border-radius: 4px; }
  `]
})
export class PageNotFoundComponent {}
