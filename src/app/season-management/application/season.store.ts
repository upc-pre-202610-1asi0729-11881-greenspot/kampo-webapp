import { inject, Injectable, signal, computed } from '@angular/core';
import { Season } from '../domain/model/season.entity';
import { SeasonStatus } from '../domain/model/season-status.enum';
import { SeasonService } from '../infrastructure/services/season.service';
import { SeasonResponse } from '../infrastructure/responses/season.response';
import { SeasonCreateResource } from '../infrastructure/responses/season-create.resource';
import { SeasonAssembler } from '../infrastructure/assemblers/season.assembler';

@Injectable({ providedIn: 'root' })
export class SeasonStore {
  private readonly seasonService = inject(SeasonService);
  private assembler = new SeasonAssembler();

  readonly seasons = signal<Season[]>([]);
  readonly selectedSeasonId = signal<number | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly seasonTableData = computed(() =>
    this.seasons().map((s) => ({
      id: s.getId(),
      fieldId: s.getFieldId(),
      cropId: s.getCropId(),
      cropName: s.getCropName(),
      status: s.getStatus(),
      startedAt: s.getStartedAt(),
      endedAt: s.getEndedAt(),
    })),
  );

  setSeasons(responses: SeasonResponse[]): void {
    const entities = responses.map((r) => this.assembler.toEntityFromResponse(r));
    this.seasons.set(entities);
  }

  loadSeasonsByField(fieldId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.seasonService.getByField(fieldId).subscribe({
      next: (responses: SeasonResponse[]) => {
        this.setSeasons(responses);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se pudieron cargar las temporadas');
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  /**
   * Carga la temporada activa de un campo (GET /seasons/active?fieldId=X).
   * Útil para mostrar "temporada en curso" sin tener que buscarla manualmente.
   */
  loadActiveByField(fieldId: number, onSuccess?: (season: Season | null) => void): void {
    this.isLoading.set(true);
    this.seasonService.getActiveByField(fieldId).subscribe({
      next: (response) => {
        const entity = this.assembler.toEntityFromResponse(response);
        onSuccess?.(entity);
      },
      error: () => {
        onSuccess?.(null);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  /**
   * Crea una temporada. Backend real: POST /seasons con { fieldId, cropName, startAt }.
   * onSuccess/onError permiten al componente actuar tras la confirmación real.
   */
  createSeason(
    fieldId: number,
    cropName: string,
    startAt: string,
    onSuccess?: (created: Season) => void,
    onError?: (err: unknown) => void,
  ): void {
    this.isLoading.set(true);
    const body = new SeasonCreateResource(fieldId, cropName, startAt);

    this.seasonService.create(body).subscribe({
      next: (response) => {
        const entity = this.assembler.toEntityFromResponse(response);
        this.addSeason(entity);
        onSuccess?.(entity);
      },
      error: (err) => onError?.(err),
      complete: () => this.isLoading.set(false),
    });
  }

  selectSeason(id: number): void {
    this.selectedSeasonId.set(id);
  }

  getSeasonById(id: number): Season | undefined {
    return this.seasons().find((s) => String(s.getId()) === String(id));
  }

  addSeason(entity: Season): void {
    this.seasons.update((list) => [...list, entity]);
  }

  private replaceSeason(updated: Season): void {
    this.seasons.update((list) => list.map((s) => (s.getId() === updated.getId() ? updated : s)));
  }

  /**
   * Cambia el estado de la temporada (PATCH /{id}/status).
   */
  updateStatus(
    seasonId: number,
    status: SeasonStatus,
    onSuccess?: (updated: Season) => void,
    onError?: (err: unknown) => void,
  ): void {
    this.isLoading.set(true);
    this.seasonService.updateStatus(seasonId, status).subscribe({
      next: (response) => {
        const updated = this.assembler.toEntityFromResponse(response);
        this.replaceSeason(updated);
        onSuccess?.(updated);
      },
      error: (err) => onError?.(err),
      complete: () => this.isLoading.set(false),
    });
  }

  /**
   * Finaliza la temporada (PATCH /{id}/end) — sin body.
   */
  endSeason(
    seasonId: number,
    onSuccess?: (updated: Season) => void,
    onError?: (err: unknown) => void,
  ): void {
    this.isLoading.set(true);
    this.seasonService.endSeason(seasonId).subscribe({
      next: (response) => {
        const updated = this.assembler.toEntityFromResponse(response);
        this.replaceSeason(updated);
        onSuccess?.(updated);
      },
      error: (err) => onError?.(err),
      complete: () => this.isLoading.set(false),
    });
  }

  /**
   * Asigna un cultivo a la temporada (PATCH /{id}/crop).
   */
  assignCrop(
    seasonId: number,
    cropId: number,
    onSuccess?: (updated: Season) => void,
    onError?: (err: unknown) => void,
  ): void {
    this.isLoading.set(true);
    this.seasonService.assignCrop(seasonId, cropId).subscribe({
      next: (response) => {
        const updated = this.assembler.toEntityFromResponse(response);
        this.replaceSeason(updated);
        onSuccess?.(updated);
      },
      error: (err) => onError?.(err),
      complete: () => this.isLoading.set(false),
    });
  }
}
