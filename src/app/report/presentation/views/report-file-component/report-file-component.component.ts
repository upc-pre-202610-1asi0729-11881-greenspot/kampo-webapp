import { Component, Input, OnInit, inject } from '@angular/core';
import { Report } from '../../../domain/model/entities/report.entity';
import { MatIcon } from '@angular/material/icon';
import { FinancialStore } from '../../../../finantial-management/application/financial.store';

@Component({
  selector: 'app-report-file-component',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './report-file-component.component.html',
  styleUrl: './report-file-component.component.css',
})
export class ReportFileComponentComponent implements OnInit {
  @Input() report!: Report;
  @Input() isLoading = false;

  private financialStore = inject(FinancialStore);

  totalExpenses = 0;
  totalSales = 0;
  totalIncomes = 0;

  maxValue = 1;

  ngOnInit(): void {
    const expenses = this.financialStore.expenses();
    const sales = this.financialStore.sales();
    const incomes = this.financialStore.incomes();

    this.totalExpenses = expenses.reduce((sum, e) => sum + e.getAmount().getAmount(), 0);
    this.totalSales = sales.reduce((sum, s) => sum + s.getTotalAmount().getAmount(), 0);
    this.totalIncomes = incomes.reduce((sum, i) => sum + i.getAmount().getAmount(), 0);

    this.maxValue = Math.max(this.totalExpenses, this.totalSales, this.totalIncomes, 1);
  }

  getBarHeight(value: number): number {
    return Math.round((value / this.maxValue) * 100);
  }
}
