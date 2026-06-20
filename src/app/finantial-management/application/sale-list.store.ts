import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { SaleApi } from '../infrastructure/sale-api';
import { SaleCreateRequest } from '../infrastructure/requests/sale-create.request';
import { SaleCreatedResponse } from '../infrastructure/responses/sale-created.response';

/**
 * Dedicated store for the real backend's Sale aggregate (POST /api/v1/sales).
 * Kept separate from FinancialStore/FinancialRecord, which still targets
 * the mock financial-records endpoint for expenses/incomes.
 */
@Injectable({ providedIn: 'root' })
export class SaleListStore {
  private readonly api = inject(SaleApi);

  readonly sales = signal<SaleCreatedResponse[]>([]);
  readonly isLoading = signal(false);

  loadAll(): void {
    this.isLoading.set(true);
    this.api
      .getAll()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (list) => this.sales.set(list),
        error: () => this.sales.set([]),
      });
  }

  loadByFundo(fundoId: number): void {
    this.isLoading.set(true);
    this.api
      .getByFundo(fundoId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (list) => this.sales.set(list),
        error: () => this.sales.set([]),
      });
  }

  /**
   * Crea una venta real en el backend.
   * onSuccess/onError permiten que el componente actúe SOLO
   * tras la confirmación real del servidor.
   */
  create(
    request: SaleCreateRequest,
    onSuccess?: (created: SaleCreatedResponse) => void,
    onError?: (err: unknown) => void,
  ): void {
    this.isLoading.set(true);
    this.api
      .create(request)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (created) => {
          this.sales.update((list) => [...list, created]);
          onSuccess?.(created);
        },
        error: (err) => onError?.(err),
      });
  }
}
