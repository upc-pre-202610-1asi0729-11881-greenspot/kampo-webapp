import { inject, Injectable, signal } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';

import { Inventory } from '../domain/model/entities/inventory.entity';
import { OrderInput } from '../domain/model/entities/order-input.entity';
import { Supplier } from '../domain/model/entities/supplier.entity';

import { InventoryApi } from '../infrastructure/inventory-api';

@Injectable({ providedIn: 'root' })
export class InventoryStore {
  private readonly api = inject(InventoryApi);

  readonly inventories = signal<Inventory[]>([]);
  readonly suppliers = signal<Supplier[]>([]);
  readonly orders = signal<OrderInput[]>([]);
  readonly selectedInventory = signal<Inventory | null>(null);
  readonly isLoading = signal(false);

  getInventories(): void {
    this.isLoading.set(true);
    this.api
      .getInventories()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (list) => this.inventories.set(list),
        error: () => this.inventories.set([]),
      });
  }

  getSuppliers(): void {
    this.isLoading.set(true);
    this.api
      .getSuppliers()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (list) => this.suppliers.set(list),
        error: () => this.suppliers.set([]),
      });
  }

  getOrders(): void {
    this.isLoading.set(true);
    this.api
      .getOrders()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (list) => this.orders.set(list),
        error: () => this.orders.set([]),
      });
  }

  updateStock(inventoryId: number, quantity: number): void {
    this.isLoading.set(true);
    this.api
      .updateStock(inventoryId, quantity)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((updated) => {
        this.inventories.update((list) =>
          list.map((i) => (i.getId() === updated.getId() ? updated : i)),
        );
        this.selectedInventory.update((sel) => (sel?.getId() === updated.getId() ? updated : sel));
      });
  }

  addSupplier(
    supplier: Supplier,
    onSuccess?: (created: Supplier) => void,
    onError?: (err: unknown) => void,
  ): void {
    this.isLoading.set(true);
    this.api
      .addSupplier(supplier)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (created) => {
          this.suppliers.update((list) => [...list, created]);
          onSuccess?.(created);
        },
        error: (err) => onError?.(err),
      });
  }

  /**
   * Crea un pedido. onSuccess/onError permiten que el componente
   * actúe (snackbar, reset de form) SOLO tras la respuesta real del backend.
   */
  orderInput(
    inventoryId: number,
    supplierId: number,
    quantity: number,
    onSuccess?: (created: OrderInput) => void,
    onError?: (err: unknown) => void,
  ): void {
    this.isLoading.set(true);
    this.api
      .orderInput(inventoryId, supplierId, quantity)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (order) => {
          this.orders.update((list) => [...list, order]);
          onSuccess?.(order);
        },
        error: (err) => onError?.(err),
      });
  }

  receiveInput(
    orderId: number,
    quantity: number,
    onSuccess?: () => void,
    onError?: (err: unknown) => void,
  ): void {
    this.isLoading.set(true);
    const currentOrder = this.orders().find((o) => o.getId() === orderId);

    this.api
      .receiveInput(orderId, quantity)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (updated) => {
          this.orders.update((list) =>
            list.map((o) => (o.getId() === updated.getId() ? updated : o)),
          );

          if (currentOrder) {
            const inventoryId = currentOrder.getInventoryId();
            const currentInventory = this.inventories().find((i) => i.getId() === inventoryId);

            if (currentInventory) {
              const newQuantity = currentInventory.getQuantity() + quantity;
              this.updateStock(inventoryId, newQuantity);
            }
          }
          onSuccess?.();
        },
        error: (err) => onError?.(err),
      });
  }

  registerInput(
    inventory: Inventory,
    onSuccess?: (created: Inventory) => void,
    onError?: (err: unknown) => void,
  ): void {
    this.isLoading.set(true);
    this.api
      .registerInput(inventory)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (created) => {
          this.inventories.update((list) => [...list, created]);
          onSuccess?.(created);
        },
        error: (err) => onError?.(err),
      });
  }

  selectInventory(inventoryId: number): void {
    const found = this.inventories().find((i) => i.getId() === inventoryId) ?? null;
    this.selectedInventory.set(found);
  }

  loadAll(): void {
    this.isLoading.set(true);

    forkJoin({
      inv: this.api.getInventories(),
      sup: this.api.getSuppliers(),
      ord: this.api.getOrders(),
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ({ inv, sup, ord }) => {
          this.inventories.set(inv);
          this.suppliers.set(sup);
          this.orders.set(ord);
        },
        error: () => {
          this.inventories.set([]);
          this.suppliers.set([]);
          this.orders.set([]);
        },
      });
  }

  deleteOrder(orderId: number, onSuccess?: () => void, onError?: (err: unknown) => void): void {
    this.isLoading.set(true);
    this.api
      .deleteOrder(orderId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.orders.update((list) => list.filter((o) => o.getId() !== orderId));
          onSuccess?.();
        },
        error: (err) => onError?.(err),
      });
  }
}
