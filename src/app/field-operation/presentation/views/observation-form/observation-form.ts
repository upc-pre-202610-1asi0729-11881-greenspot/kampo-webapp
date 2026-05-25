import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldOperationStore } from '../../../application/field-operation.store';
import { Severity } from '../../../domain/model/enums/severity.enum';

@Component({
  selector: 'app-observation-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './observation-form.html'
})
export class ObservationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  public store = inject(FieldOperationStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly severityOptions = Object.values(Severity);
  isLoading = false;
  fieldVisitId: number | null = null;

  form: FormGroup = this.fb.group({
    fieldVisitId: [0, [Validators.required, Validators.min(1)]],
    notes: ['', Validators.required],
    pestName: [''],
    pestSeverity: [Severity.LOW],
    diseaseName: [''],
    diseaseSeverity: [Severity.LOW],
    recommendation: ['']
  });

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap.get('fieldVisitId');
    if (q) {
      this.fieldVisitId = Number(q);
      this.form.patchValue({ fieldVisitId: this.fieldVisitId });
    }
  }

  onRegisterObservation(): void {
    if (this.form.invalid) return;
    const val = this.form.value;
    this.store.registerObservation(
      val.fieldVisitId,
      val.notes,
      val.pestName,
      val.pestSeverity,
      val.diseaseName,
      val.diseaseSeverity,
      val.recommendation
    );
    this.router.navigate(['/field-operation/view', val.fieldVisitId]);
  }

  onUploadEvidence(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length && this.fieldVisitId) {
      this.store.uploadEvidence(this.fieldVisitId, input.files[0]);
    }
  }

  cancel(): void {
    const fvId = this.form.get('fieldVisitId')?.value;
    this.router.navigate(['/field-operation/view', fvId]);
  }
}
