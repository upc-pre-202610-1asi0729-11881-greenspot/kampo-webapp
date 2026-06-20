import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InventoryStore } from '../../../application/inventory.store';
import { Supplier } from '../../../domain/model/entities/supplier.entity';

@Component({
  selector: 'app-supplier-form-component',
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
  templateUrl: './supplier-form-component.html',
  styleUrl: './supplier-form-component.css',
})
export class SupplierFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(InventoryStore);
  readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    contact: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  /**
   * Envía POST /api/v1/suppliers con { name, contact, email }.
   * El token JWT se agrega automáticamente vía authInterceptor.
   * Solo navega y muestra éxito SI el backend confirma la creación.
   */
  onAddSupplier(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const supplier = new Supplier(0, v.name, v.contact, v.email);

    this.store.addSupplier(
      supplier,
      () => {
        this.snackBar.open('Proveedor creado correctamente.', 'OK', { duration: 2500 });
        this.form.reset({ name: '', contact: '', email: '' });
        this.router.navigate(['/inventory-management/pedidos']);
      },
      (err) => {
        console.error('Error al crear proveedor:', err);
        this.snackBar.open('No se pudo crear el proveedor. Verifica tu sesión.', 'OK', {
          duration: 3000,
        });
      },
    );
  }

  cancel(): void {
    this.router.navigate(['/inventory-management/pedidos']);
  }
}
