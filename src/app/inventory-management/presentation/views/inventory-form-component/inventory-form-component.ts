import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InventoryStore } from '../../../application/inventory.store';
import { Inventory } from '../../../domain/model/entities/inventory.entity';

@Component({
  selector: 'app-inventory-form-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './inventory-form-component.html',
  styleUrl: './inventory-form-component.css',
})
export class InventoryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly store = inject(InventoryStore);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]],
    unit: ['', Validators.required],
    minStock: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {}

  onRegisterInput(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const status = Inventory.resolveStatus(v.quantity, v.minStock);
    const entity = new Inventory(0, v.name, v.quantity, v.unit, v.minStock, status);
    this.store.registerInput(entity);
    this.snackBar.open('Ítem registrado (pendiente de API).', 'OK', { duration: 2500 });
    this.router.navigate(['/inventory-management/inventario']);
  }

  onUpdateStock(): void {
    const inv = this.store.selectedInventory();
    if (!inv || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const qty = this.form.controls.quantity.value;
    this.store.updateStock(inv.getId(), qty);
    this.snackBar.open('Stock actualizado.', 'OK', { duration: 2000 });
  }

  cancel(): void {
    this.router.navigate(['/inventory-management/inventario']);
  }
}
