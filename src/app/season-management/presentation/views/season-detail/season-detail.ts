import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { SeasonStore } from '../../../application/season.store';
import { Season } from '../../../domain/model/season.entity';
import { SeasonStatus } from '../../../domain/model/season-status.enum';

@Component({
  selector: 'app-season-detail',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './season-detail.html',
})
export class SeasonDetailComponent implements OnInit {
  public store = inject(SeasonStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly statusOptions = Object.values(SeasonStatus);
  readonly newCropId = signal<number>(0);

  season: Season | undefined;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.season = this.store.getSeasonById(id);
  }

  showSeasonStatus(): string {
    return this.season?.getStatus() ?? '-';
  }

  showCropName(): string {
    return this.season?.getCropName() ?? '-';
  }

  isEnded(): boolean {
    return this.season?.getStatus() === SeasonStatus.ENDED;
  }

  /**
   * PATCH /api/v1/seasons/{id}/status
   */
  onChangeStatus(newStatus: SeasonStatus): void {
    if (!this.season) return;
    this.store.updateStatus(
      this.season.getId(),
      newStatus,
      (updated) => {
        this.season = updated;
        this.snackBar.open('Estado actualizado.', 'OK', { duration: 2000 });
      },
      (err) => {
        console.error(err);
        this.snackBar.open('No se pudo actualizar el estado.', 'OK', { duration: 3000 });
      },
    );
  }

  /**
   * PATCH /api/v1/seasons/{id}/end — sin body.
   */
  onEndSeason(): void {
    if (!this.season) return;
    if (!confirm('¿Finalizar esta temporada? Esta acción no se puede deshacer.')) return;

    this.store.endSeason(
      this.season.getId(),
      (updated) => {
        this.season = updated;
        this.snackBar.open('Temporada finalizada.', 'OK', { duration: 2500 });
      },
      (err) => {
        console.error(err);
        this.snackBar.open('No se pudo finalizar la temporada.', 'OK', { duration: 3000 });
      },
    );
  }

  /**
   * PATCH /api/v1/seasons/{id}/crop
   */
  onAssignCrop(): void {
    if (!this.season || !this.newCropId()) return;

    this.store.assignCrop(
      this.season.getId(),
      this.newCropId(),
      (updated) => {
        this.season = updated;
        this.newCropId.set(0);
        this.snackBar.open('Cultivo asignado.', 'OK', { duration: 2000 });
      },
      (err) => {
        console.error(err);
        this.snackBar.open('No se pudo asignar el cultivo.', 'OK', { duration: 3000 });
      },
    );
  }

  back(): void {
    const fid = this.season?.getFieldId() ?? 1;
    this.router.navigate(['/season-management'], { queryParams: { fieldId: fid } });
  }
}
