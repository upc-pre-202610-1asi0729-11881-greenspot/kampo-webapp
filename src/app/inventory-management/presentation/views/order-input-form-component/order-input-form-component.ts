import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventoryStore } from '../../../application/inventory.store';
import { OrderStatus } from '../../../domain/model/enums/order-status.enum';

@Component({
  selector: 'app-order-input-form-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './order-input-form-component.html',
  styleUrl: './order-input-form-component.css',
})
export class OrderInputFormComponent implements OnInit {
  readonly orderStatus = OrderStatus;
  private readonly fb = inject(FormBuilder);
  readonly store = inject(InventoryStore);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = this.fb.nonNullable.group({
    inventoryId: [0, [Validators.required, Validators.min(1)]],
    supplierId: [0, [Validators.required, Validators.min(1)]],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  readonly orderColumns: string[] = [
    'id',
    'inventory',
    'supplier',
    'quantity',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    if (!this.store.inventories().length) {
      this.store.getInventories();
    }
    if (!this.store.suppliers().length) {
      this.store.getSuppliers();
    }
    if (!this.store.orders().length) {
      this.store.getOrders();
    }
  }

  inventoryLabel(id: number): string {
    return (
      this.store
        .inventories()
        .find((i) => i.getId() === id)
        ?.getName() ?? `#${id}`
    );
  }

  supplierLabel(id: number): string {
    return (
      this.store
        .suppliers()
        .find((s) => s.getId() === id)
        ?.getName() ?? `#${id}`
    );
  }

  orderStatusLabel(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Pendiente';
      case OrderStatus.RECEIVED:
        return 'Recibido';
      case OrderStatus.CANCELLED:
        return 'Cancelado';
      default:
        return String(status);
    }
  }

  /**
   * Envía POST /api/v1/order-inputs con { inventoryId, supplierId, quantity }.
   * El token JWT viaja automáticamente vía authInterceptor.
   * Solo resetea el formulario y muestra éxito SI el backend confirma.
   */
  onOrderInput(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();

    this.store.orderInput(
      v.inventoryId,
      v.supplierId,
      v.quantity,
      () => {
        this.snackBar.open('Pedido creado exitosamente.', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.form.reset({ inventoryId: 0, supplierId: 0, quantity: 1 });
      },
      (err) => {
        console.error('Error al crear pedido:', err);
        this.snackBar.open('No se pudo crear el pedido. Verifica tu sesión.', 'Cerrar', {
          duration: 3000,
        });
      },
    );
  }

  onReceiveInput(orderId: number, quantity: number): void {
    this.store.receiveInput(
      orderId,
      quantity,
      () => this.snackBar.open('Recepción registrada.', 'OK', { duration: 2000 }),
      (err) => {
        console.error('Error al recibir pedido:', err);
        this.snackBar.open('No se pudo registrar la recepción.', 'OK', { duration: 3000 });
      },
    );
  }

  onDeleteOrder(orderId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      this.store.deleteOrder(
        orderId,
        () => this.snackBar.open('Pedido eliminado exitosamente.', 'Cerrar', { duration: 3000 }),
        (err) => {
          console.error('Error al eliminar pedido:', err);
          this.snackBar.open('No se pudo eliminar el pedido.', 'Cerrar', { duration: 3000 });
        },
      );
    }
  }
}
