import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FinancialStore } from '../../../application/financial.store';
import { ExpenseCategory } from '../../../domain/model/enums/expense-category.enum';
import { Money } from '../../../domain/model/value-object/money.vo';

@Component({
  selector: 'app-expensive-form-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './expensive-form-component.html',
  styleUrl: './expensive-form-component.css',
})
export class ExpenseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(FinancialStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  readonly categoryOptions = [
    { value: ExpenseCategory.LABOR, label: 'Mano de obra' },
    { value: ExpenseCategory.INPUT, label: 'Insumos' },
    { value: ExpenseCategory.TRANSPORT, label: 'Transporte' },
    { value: ExpenseCategory.MAINTENANCE, label: 'Mantenimiento' },
    { value: ExpenseCategory.OTHER, label: 'Otros' },
  ];

  readonly form = this.fb.nonNullable.group({
    description: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    currency: ['PEN', Validators.required],
    category: [ExpenseCategory.OTHER, Validators.required],
    date: ['', Validators.required],
  });

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10);
    if (!this.form.controls.date.value) {
      this.form.patchValue({ date: today });
    }
  }

  submit(): void {
    if (this.form.invalid || !this.store.hasRecord()) {
      this.form.markAllAsTouched();
      if (!this.store.hasRecord()) {
        this.snackBar.open('No hay registro financiero cargado.', 'Cerrar', { duration: 4000 });
      }
      return;
    }
    const v = this.form.getRawValue();
    const money = new Money(v.amount, v.currency);
    this.store.addExpense(v.description, money, v.category, new Date(v.date));
    this.snackBar.open('Gasto registrado.', 'OK', { duration: 2500 });
    this.router.navigate(['..'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }

  cancel(): void {
    this.router.navigate(['..'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }
}
