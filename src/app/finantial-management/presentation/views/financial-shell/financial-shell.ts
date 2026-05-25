import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FinancialStore } from '../../../application/financial.store';
import { FundoId } from '../../../domain/model/value-object/fundo-id.vo';
import { SeasonId } from '../../../domain/model/value-object/season-id.vo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-financial-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './financial-shell.html',
  styleUrl: './financial-shell.css',
})
export class FinancialShellComponent {
  readonly store = inject(FinancialStore);
  private readonly route = inject(ActivatedRoute);

  readonly fundoLabel = computed(() => this.store.selectedFundoId()?.getValue().toString() ?? '—');
  readonly seasonLabel = computed(() => this.store.selectedSeasonId()?.getValue().toString() ?? '—');


  readonly navLinks = [
    { path: 'gastos', label: 'Gastos', icon: 'receipt_long' },
    { path: 'ingresos', label: 'Ingresos', icon: 'trending_up' },
    { path: 'ventas', label: 'Ventas', icon: 'sell' },
    { path: 'rentabilidad', label: 'Rentabilidad', icon: 'analytics' },
  ] as const;

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((pm) => {
      const fundo = Number(pm.get('fundoId') ?? 1);
      const season = Number(pm.get('seasonId') ?? 1);

      this.store.loadRecord(new FundoId(fundo), new SeasonId(season));
    });
  }
}
