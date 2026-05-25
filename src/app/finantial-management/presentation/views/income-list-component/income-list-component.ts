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
  selector: 'app-income-list-component',
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
  templateUrl: './income-list-component.html',
  styleUrl: './income-list-component.css',
})
export class IncomeListComponent {
  private readonly store = inject(FinancialStore);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = this.store.isLoading;
  readonly hasRecord = this.store.hasRecord;

  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  readonly fromDate = signal('');
  readonly toDate = signal('');

  readonly incomeForm = this.fb.nonNullable.group({
    description: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    currency: ['PEN', Validators.required],
    date: ['', Validators.required],
  });

  readonly filteredIncomes = computed(() => {
    const record = this.store.record();
    const all = record?.getIncomes() ?? [];
    const from = this.fromDate();
    const to = this.toDate();
    if (!from && !to) {
      return all;
    }
    return all.filter((i) => {
      const d = i.getDate();
      const t = d.getTime();
      if (from && t < new Date(from).getTime()) {
        return false;
      }
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        if (t > end.getTime()) {
          return false;
        }
      }
      return true;
    });
  });

  readonly pagedIncomes = computed(() => {
    const all = this.filteredIncomes();
    const start = this.pageIndex() * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  readonly displayedColumns: string[] = ['description', 'amount', 'date', 'actions'];

  onPage(ev: PageEvent): void {
    this.pageIndex.set(ev.pageIndex);
    this.pageSize.set(ev.pageSize);
  }

  applyDateFilter(): void {
    this.pageIndex.set(0);
  }

  setFromDate(ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    this.fromDate.set(v);
    this.applyDateFilter();
  }

  setToDate(ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    this.toDate.set(v);
    this.applyDateFilter();
  }

  clearDateFilter(): void {
    this.fromDate.set('');
    this.toDate.set('');
    this.pageIndex.set(0);
  }

  submitIncome(): void {
    if (this.incomeForm.invalid || !this.store.hasRecord()) {
      this.incomeForm.markAllAsTouched();
      return;
    }
    const v = this.incomeForm.getRawValue();
    this.store.addIncome(v.description, new Money(v.amount, v.currency), new Date(v.date));
    this.snackBar.open('Ingreso registrado.', 'OK', { duration: 2500 });
    const today = new Date().toISOString().slice(0, 10);
    this.incomeForm.reset({
      description: '',
      amount: 0,
      currency: 'PEN',
      date: today,
    });
  }

  onPanelOpened(): void {
    const today = new Date().toISOString().slice(0, 10);
    if (!this.incomeForm.controls.date.value) {
      this.incomeForm.patchValue({ date: today });
    }
  }
}
