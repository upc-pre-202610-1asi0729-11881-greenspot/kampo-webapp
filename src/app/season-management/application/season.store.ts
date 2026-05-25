import { inject, Injectable, signal, computed } from '@angular/core';
import { Season } from '../domain/model/season.entity';
import { SeasonStatus } from '../domain/model/season-status.enum';
import { SeasonService } from '../infrastructure/services/season.service';
import { SeasonResponse } from '../infrastructure/responses/season.response';
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
    }))
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

  loadAllSeasons(): void {
    this.isLoading.set(true);
    this.seasonService.getAll().subscribe({
      next: (responses) => this.setSeasons(responses),
      error: (err) => console.error(err),
      complete: () => this.isLoading.set(false)
    });
  }

  createSeason(body: any): void {
    this.seasonService.create(body).subscribe({
      next: (response) => {
        const entity = this.assembler.toEntityFromResponse(response);
        this.addSeason(entity);
      },
      error: (err) => console.error(err)
    });
  }

  selectSeason(id: number): void {
    this.selectedSeasonId.set(id);
  }

  getSeasonById(id: number): Season | undefined {
    return this.seasons().find((s) => s.getId() === id);
  }

  addSeason(entity: Season): void {
    this.seasons.update((list) => [...list, entity]);
  }

  updateSeason(entity: Season): void {
    this.seasons.update((list) => list.map((s) => (s.getId() === entity.getId() ? entity : s)));
  }
}
