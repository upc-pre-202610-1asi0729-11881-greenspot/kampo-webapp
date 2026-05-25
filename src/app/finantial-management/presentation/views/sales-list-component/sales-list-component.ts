import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
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
import { FinancialStore } from '../../../application/financial.store';
import { Money } from '../../../domain/model/value-object/money.vo';

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
export class SaleListComponent {
  private readonly store = inject(FinancialStore);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = this.store.isLoading;
  readonly hasRecord = this.store.hasRecord;

  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  readonly saleForm = this.fb.nonNullable.group({
    cropName: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(0.01)]],
    pricePerUnit: [0, [Validators.required, Validators.min(0.01)]],
    currency: ['PEN', Validators.required],
    date: ['', Validators.required],
  });

  readonly salesRows = computed(() => this.store.record()?.getSales() ?? []);

  readonly pagedSales = computed(() => {
    const all = this.salesRows();
    const start = this.pageIndex() * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  readonly totalRevenue = computed(() => {
    const record = this.store.record();
    const list = record?.getSales() ?? [];
    const currency = list[0]?.getPricePerUnit().getCurrency() ?? 'PEN';
    const zero = new Money(0, currency);
    return list.reduce((acc, s) => acc.add(s.getTotalAmount()), zero);
  });

  readonly displayedColumns: string[] = ['cropName', 'quantity', 'unitPrice', 'total', 'date', 'actions'];

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

  submitSale(): void {
    if (this.saleForm.invalid || !this.store.hasRecord()) {
      this.saleForm.markAllAsTouched();
      return;
    }
    const v = this.saleForm.getRawValue();
    const unit = new Money(v.pricePerUnit, v.currency);
    this.store.addSale(v.cropName, v.quantity, unit, new Date(v.date));
    this.snackBar.open('Venta registrada.', 'OK', { duration: 2500 });
    const today = new Date().toISOString().slice(0, 10);
    this.saleForm.reset({
      cropName: '',
      quantity: 1,
      pricePerUnit: 0,
      currency: 'PEN',
      date: today,
    });
  }
}
