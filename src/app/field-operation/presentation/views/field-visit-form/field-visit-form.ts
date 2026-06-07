import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FieldOperationStore } from '../../../application/field-operation.store';

@Component({
  selector: 'app-field-visit-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './field-visit-form.html',
  styleUrl: './field-visit-form.css',
})
export class FieldVisitFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  public store = inject(FieldOperationStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  fieldId: number | null = null;

  form: FormGroup = this.fb.group({
    fieldId: [1, [Validators.required, Validators.min(1)]],
    purpose: ['', Validators.required],
    technician: ['', Validators.required],
    scheduledAt: ['', Validators.required],
  });

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap.get('fieldId');
    if (q) {
      this.fieldId = Number(q);
      this.form.patchValue({ fieldId: this.fieldId });
    }
  }

  onScheduleFieldVisit(): void {
    if (this.form.invalid) return;
    const val = this.form.value;
    this.store.scheduleFieldVisit(
      val.fieldId,
      val.purpose,
      val.technician,
      new Date(val.scheduledAt),
    );
    this.router.navigate(['/field-operation'], { queryParams: { fieldId: val.fieldId } });
  }
  cancel(): void {
    this.router.navigate(['/field-operation'], {
      queryParams: { fieldId: this.form.get('fieldId')?.value ?? 1 },
    });
  }
}
