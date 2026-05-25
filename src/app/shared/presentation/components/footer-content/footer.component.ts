import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <p>&copy; 2026 GreenSpot - Kampo Agricultural Management. Todos los derechos reservados.</p>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #1b1f23;
      color: #a0aab2;
      text-align: center;
      padding: 1.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class FooterComponent {}
