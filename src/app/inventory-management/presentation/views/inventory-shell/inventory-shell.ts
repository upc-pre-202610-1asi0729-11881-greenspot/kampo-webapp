import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventoryStore } from '../../../application/inventory.store';

@Component({
  selector: 'app-inventory-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './inventory-shell.html',
  styleUrl: './inventory-shell.css',
})
export class InventoryShellComponent {
  readonly store = inject(InventoryStore);

  readonly navLinks = [
    { path: 'inventario', label: 'Inventario', icon: 'inventory_2' },
    { path: 'inventario/registro', label: 'Nuevo ítem', icon: 'add_box' },
    { path: 'proveedores/nuevo', label: 'Proveedor', icon: 'local_shipping' },
    { path: 'pedidos', label: 'Pedidos', icon: 'shopping_cart' },
    { path: 'panel', label: 'Stock', icon: 'dashboard' },
  ] as const;

  constructor() {
    this.store.loadAll();
  }
}
