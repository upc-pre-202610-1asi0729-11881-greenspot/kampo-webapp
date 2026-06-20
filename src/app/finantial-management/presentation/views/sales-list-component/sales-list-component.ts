import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SaleListStore } from '../../../application/sale-list.store';
import { SaleCreateRequest } from '../../../infrastructure/requests/sale-create.request';

@Component({
  selector: 'app-sales-list-component',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSnackBarModule,
  ],
  templateUrl: './sales-list-component.html',
  styleUrl: './sales-list-component.css',
})
export class SaleListComponent implements OnInit {
  readonly store = inject(SaleListStore);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = this.store.isLoading;

  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  // NOTA: por ahora fundoId es un input numérico simple.
  // Cuando el módulo de Organization esté integrado aquí, este
  // campo puede reemplazarse por un <mat-select> con los fundos reales.
  readonly saleForm = this.fb.nonNullable.group({
    cropName: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(0.01)]],
    pricePerUnit: [0, [Validators.required, Validators.min(0.01)]],
    currency: ['PEN', Validators.required],
    fundoId: [0, [Validators.required, Validators.min(1)]],
    date: ['', Validators.required],
  });

  readonly salesRows = computed(() => this.store.sales());

  readonly pagedSales = computed(() => {
    const all = this.salesRows();
    const start = this.pageIndex() * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  readonly totalRevenue = computed(() => {
    const list = this.salesRows();
    return list.reduce((acc, s) => acc + s.quantity * s.pricePerUnit, 0);
  });

  readonly totalCurrency = computed(() => this.salesRows()[0]?.currency ?? 'PEN');

  readonly displayedColumns: string[] = [
    'cropName',
    'quantity',
    'unitPrice',
    'total',
    'fundoId',
    'date',
  ];

  ngOnInit(): void {
    this.store.loadAll();
  }

  onPage(ev: PageEvent): void {
    this.pageIndex.set(ev.pageIndex);
    this.pageSize.set(ev.pageSize);
  }

  onPanelOpened(): void {
    const today = new Date().toISOString().slice(0, 10);
    if (!this.saleForm.controls.date.value) {
      this.saleForm.patchValue({ date: today });
    }
  }

  getRowTotal(row: { quantity: number; pricePerUnit: number }): number {
    return row.quantity * row.pricePerUnit;
  }

  /**
   * Envía POST /api/v1/sales con { cropName, quantity, pricePerUnit, currency, fundoId, date }.
   * El token JWT se agrega automáticamente vía authInterceptor.
   */
  submitSale(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }
    const v = this.saleForm.getRawValue();
    const request = new SaleCreateRequest(
      v.cropName,
      v.quantity,
      v.pricePerUnit,
      v.currency,
      v.fundoId,
      v.date,
    );

    this.store.create(
      request,
      () => {
        this.snackBar.open('Venta registrada.', 'OK', { duration: 2500 });
        const today = new Date().toISOString().slice(0, 10);
        this.saleForm.reset({
          cropName: '',
          quantity: 1,
          pricePerUnit: 0,
          currency: 'PEN',
          fundoId: v.fundoId, // mantiene el último fundo usado por comodidad
          date: today,
        });
      },
      (err) => {
        console.error('Error al registrar venta:', err);
        this.snackBar.open('No se pudo registrar la venta. Verifica tu sesión.', 'OK', {
          duration: 3000,
        });
      },
    );
  }
}
