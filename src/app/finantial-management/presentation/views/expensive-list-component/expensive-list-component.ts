import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ExpenseCategory } from '../../../domain/model/enums/expense-category.enum';
import { FinancialStore } from '../../../application/financial.store';

@Component({
  selector: 'app-expensive-list-component',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './expensive-list-component.html',
  styleUrl: './expensive-list-component.css',
})
export class ExpenseListComponent {
  private readonly store = inject(FinancialStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = this.store.isLoading;
  readonly hasRecord = this.store.hasRecord;

  readonly categoryFilter = signal<ExpenseCategory | ''>('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  readonly categoryOptions = [
    { value: '' as const, label: 'Todas' },
    { value: ExpenseCategory.LABOR, label: 'Mano de obra' },
    { value: ExpenseCategory.INPUT, label: 'Insumos' },
    { value: ExpenseCategory.TRANSPORT, label: 'Transporte' },
    { value: ExpenseCategory.MAINTENANCE, label: 'Mantenimiento' },
    { value: ExpenseCategory.OTHER, label: 'Otros' },
  ];

  readonly filteredExpenses = computed(() => {
    const record = this.store.record();
    const all = record?.getExpenses() ?? [];
    const cat = this.categoryFilter();
    return cat ? all.filter((e) => e.getCategory() === cat) : all;
  });

  readonly pagedExpenses = computed(() => {
    const all = this.filteredExpenses();
    const start = this.pageIndex() * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  readonly displayedColumns: string[] = ['description', 'amount', 'category', 'date', 'actions'];

  onCategoryChange(value: ExpenseCategory | ''): void {
    this.categoryFilter.set(value);
    this.pageIndex.set(0);
  }

  onPage(ev: PageEvent): void {
    this.pageIndex.set(ev.pageIndex);
    this.pageSize.set(ev.pageSize);
  }

  categoryLabel(cat: ExpenseCategory): string {
    return this.categoryOptions.find((o) => o.value === cat)?.label ?? cat;
  }

  onAddExpense(): void {
    this.router.navigate(['nuevo'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }

  clearFilter(): void {
    this.categoryFilter.set('');
    this.pageIndex.set(0);
  }
}
