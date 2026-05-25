import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldOperationStore } from '../../../application/field-operation.store';

@Component({
  selector: 'app-field-visit-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './field-visit-form.html'
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
    scheduledAt: ['', Validators.required]
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
    this.store.scheduleFieldVisit(val.fieldId, new Date(val.scheduledAt));
    this.router.navigate(['/field-operation'], { queryParams: { fieldId: val.fieldId } });
  }

  cancel(): void {
    this.router.navigate(['/field-operation'], {
      queryParams: { fieldId: this.form.get('fieldId')?.value ?? 1 }
    });
  }
}
