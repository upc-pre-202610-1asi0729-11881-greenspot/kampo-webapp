import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventoryStore } from '../../../application/inventory.store';
import { Inventory } from '../../../domain/model/entities/inventory.entity';
import { InventoryStatus } from '../../../domain/model/enums/inventory-status.enum';

@Component({
  selector: 'app-stock-dashboard-component',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './stock-dashboard-component.html',
  styleUrl: './stock-dashboard-component.css',
})
export class StockDashboardComponent implements OnInit {
  readonly store = inject(InventoryStore);

  ngOnInit(): void {
    if (!this.store.inventories().length) {
      this.store.getInventories();
    }
  }

  showStockStatus(inv: Inventory): string {
    switch (inv.getStatus()) {
      case InventoryStatus.AVAILABLE:
        return 'Stock saludable';
      case InventoryStatus.LOW_STOCK:
        return 'Por debajo del mínimo';
      case InventoryStatus.OUT_OF_STOCK:
        return 'Sin existencias';
      default:
        return '—';
    }
  }
}
