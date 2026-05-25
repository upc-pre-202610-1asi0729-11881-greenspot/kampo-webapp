import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { InventoryStore } from '../../../application/inventory.store';
import { InventoryStatus } from '../../../domain/model/enums/inventory-status.enum';
import { Inventory } from '../../../domain/model/entities/inventory.entity';

@Component({
  selector: 'app-inventory-list-component',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './inventory-list-component.html',
  styleUrl: './inventory-list-component.css',
})
export class InventoryListComponent implements OnInit {
  readonly store = inject(InventoryStore);

  readonly displayedColumns: string[] = ['name', 'quantity', 'unit', 'status', 'actions'];

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

  onSelectInventory(inventoryId: number): void {
    this.store.selectInventory(inventoryId);
  }

  isSelected(row: Inventory): boolean {
    return this.store.selectedInventory()?.getId() === row.getId();
  }

  ngOnInit(): void {
    if (!this.store.inventories().length) {
      this.store.getInventories();
    }
  }
}