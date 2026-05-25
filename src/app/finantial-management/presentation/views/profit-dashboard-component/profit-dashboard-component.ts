import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FinancialStore } from '../../../application/financial.store';

@Component({
  selector: 'app-profit-dashboard-component',
  standalone: true,
  imports: [
    DecimalPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profit-dashboard-component.html',
  styleUrl: './profit-dashboard-component.css',
})
export class ProfitabilityDashboardComponent implements OnInit {
  readonly store = inject(FinancialStore);

  ngOnInit(): void {
    this.loadProfitability();
  }

  loadProfitability(): void {
    this.store.computeProfitability();
  }

  getMarginColor(): string {
    const p = this.store.profitability();
    if (!p) {
      return 'inherit';
    }
    return p.isProfit() ? '#2e7d32' : '#c62828';
  }
}
