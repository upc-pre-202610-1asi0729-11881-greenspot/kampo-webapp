import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SeasonStore } from '../../../application/season.store';
import { Season } from '../../../domain/model/season.entity';
import { SeasonStatus } from '../../../domain/model/season-status.enum';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-season-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './season-form.html',
  styleUrl: './season-form.css',
})
export class SeasonFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  public store = inject(SeasonStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly statusOptions = Object.values(SeasonStatus);

  form: FormGroup = this.fb.group({
    id: [0],
    fieldId: [1, [Validators.required, Validators.min(1)]],
    cropId: [0, [Validators.required, Validators.min(0)]],
    cropName: ['', Validators.required],
    status: [SeasonStatus.PLANTING, Validators.required],
    startedAt: ['', Validators.required],
  });

  isEdit = false;

  ngOnInit(): void {
    const fieldIdParam = this.route.snapshot.queryParamMap.get('fieldId');
    const fieldId = fieldIdParam ? Number(fieldIdParam) : 1;

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.store.loadAllSeasons();

      setTimeout(() => {
        const season = this.store.getSeasonById(+id);
        if (season) {
          this.form.patchValue({
            id: season.getId(),
            fieldId: season.getFieldId(),
            cropId: season.getCropId(),
            cropName: season.getCropName(),
            status: season.getStatus(),
            startedAt: season.getStartedAt().toISOString().slice(0, 10),
          });
        }
      }, 1000);
    } else {
      this.form.patchValue({ fieldId });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const val = this.form.value;

    if (this.isEdit) {
      const entity = new Season(
        val.id,
        val.fieldId,
        val.cropId,
        val.cropName,
        val.status as SeasonStatus,
        new Date(val.startedAt),
        null,
      );
      this.store.updateSeason(entity);
    } else {
      this.store.createSeason({
        fieldId: val.fieldId,
        cropId: val.cropId,
        cropName: val.cropName,
        status: val.status,
        startedAt: new Date(val.startedAt).toISOString(),
        endedAt: null,
      });
    }

    this.router.navigate(['/season-management'], {
      queryParams: { fieldId: val.fieldId },
    });
  }

  cancel(): void {
    const fieldId = this.form.get('fieldId')?.value ?? 1;
    this.router.navigate(['/season-management'], {
      queryParams: { fieldId },
    });
  }
}
