import { Component, effect, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InventoryListComponent } from '../inventory-list-component/inventory-list-component';
import { InventoryStore } from '../../../application/inventory.store';
import { InventoryStatus } from '../../../domain/model/enums/inventory-status.enum';

@Component({
  selector: 'app-inventory-view-component',
  standalone: true,
  imports: [
    InventoryListComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './inventory-view-component.html',
  styleUrl: './inventory-view-component.css',
})
export class InventoryViewComponent implements OnInit {
  readonly store = inject(InventoryStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly stockForm = this.fb.nonNullable.group({
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    effect(() => {
      const inv = this.store.selectedInventory();
      if (inv) {
        this.stockForm.patchValue({ quantity: inv.getQuantity() });
      }
    });
  }

  ngOnInit(): void {
    if (!this.store.inventories().length) {
      this.store.getInventories();
    }
  }

  statusLabel(status: InventoryStatus): string {
    switch (status) {
      case InventoryStatus.AVAILABLE:
        return 'Disponible';
      case InventoryStatus.LOW_STOCK:
        return 'Stock bajo';
      case InventoryStatus.OUT_OF_STOCK:
        return 'Agotado';
      default:
        return String(status);
    }
  }

  onUpdateStock(): void {
    const inv = this.store.selectedInventory();
    if (!inv || this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }
    const qty = this.stockForm.controls.quantity.value;
    this.store.updateStock(inv.getId(), qty);
    this.snackBar.open('Stock actualizado (pendiente de API).', 'OK', { duration: 2500 });
  }

  onRegisterInput(): void {
    this.router.navigate(['/inventory-management/inventario/registro']);
  }

  onSelectInventory(inventoryId: number): void {
    this.store.selectInventory(inventoryId);
  }
}
