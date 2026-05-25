import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InventoryStore } from '../../../application/inventory.store';
import { Supplier } from '../../../domain/model/entities/supplier.entity';

@Component({
  selector: 'app-supplier-contact-view-component',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './supplier-contact-view-component.html',
  styleUrl: './supplier-contact-view-component.css',
})
export class SupplierContactViewComponent {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(InventoryStore);
  readonly router = inject(Router);

  readonly supplier = signal<Supplier | null>(null);

  constructor() {
    effect(() => {
      const list = this.store.suppliers();
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.supplier.set(list.find((s) => s.getId() === id) ?? null);
    });
    if (!this.store.suppliers().length) {
      this.store.getSuppliers();
    }
  }

  showContact(): string {
    const s = this.supplier();
    if (!s) {
      return 'Proveedor no encontrado.';
    }
    return `${s.getName()} — ${s.getContact()} — ${s.getEmail()}`;
  }
}
