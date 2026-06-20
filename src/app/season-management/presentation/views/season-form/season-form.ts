import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SeasonStore } from '../../../application/season.store';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

/**
 * Solo creación — el backend real NO tiene PUT /{id}.
 * Para modificar una temporada existente se usan los endpoints específicos:
 * updateStatus, endSeason, assignCrop (ver SeasonDetailComponent).
 */
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
    MatSnackBarModule,
  ],
  templateUrl: './season-form.html',
  styleUrl: './season-form.css',
})
export class SeasonFormComponent {
  private fb = inject(FormBuilder);
  public store = inject(SeasonStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    fieldId: [1, [Validators.required, Validators.min(1)]],
    cropName: ['', Validators.required],
    startAt: ['', Validators.required],
  });

  constructor() {
    const fieldIdParam = this.route.snapshot.queryParamMap.get('fieldId');
    if (fieldIdParam) {
      this.form.patchValue({ fieldId: Number(fieldIdParam) });
    }
  }

  /**
   * Envía POST /api/v1/seasons con { fieldId, cropName, startAt }.
   * El token JWT viaja automáticamente vía authInterceptor.
   */
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const val = this.form.value;
    const startAt = new Date(val.startAt).toISOString().slice(0, 10);

    this.store.createSeason(
      val.fieldId,
      val.cropName,
      startAt,
      () => {
        this.snackBar.open('Temporada creada correctamente.', 'OK', { duration: 2500 });
        this.router.navigate(['/season-management'], { queryParams: { fieldId: val.fieldId } });
      },
      (err) => {
        console.error('Error al crear temporada:', err);
        this.snackBar.open('No se pudo crear la temporada. Verifica tu sesión.', 'OK', {
          duration: 3000,
        });
      },
    );
  }

  cancel(): void {
    const fieldId = this.form.get('fieldId')?.value ?? 1;
    this.router.navigate(['/season-management'], { queryParams: { fieldId } });
  }
}
