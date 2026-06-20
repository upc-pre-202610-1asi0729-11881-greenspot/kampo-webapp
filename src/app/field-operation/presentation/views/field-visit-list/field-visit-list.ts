import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { FieldOperationStore } from '../../../application/field-operation.store';
import { FieldVisitStatus } from '../../../domain/model/enums/field-visit-status.enum';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-field-visit-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTabsModule,
  ],
  templateUrl: './field-visit-list.html',
  styleUrls: ['./field-visit-list.css'],
})
export class FieldVisitListComponent implements OnInit {
  public store = inject(FieldOperationStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  displayedColumns: string[] = [
    'id',
    'fieldId',
    'scheduledAt',
    'doneAt',
    'status',
    'observationCount',
    'actions',
  ];
  fieldId = 1;

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap.get('fieldId');
    this.fieldId = q ? Number(q) : 1;
    this.store.loadFieldVisits(this.fieldId);
  }

  navigateToNew(): void {
    this.router.navigate(['/field-operation/new'], { queryParams: { fieldId: this.fieldId } });
  }

  onSelectFieldVisit(id: number): void {
    this.store.selectFieldVisit(id);
    this.router.navigate(['/field-operation/view', id]);
  }

  onCompleteFieldVisit(id: number): void {
    this.store.completeFieldVisit(id);
  }

  statusLabel(status: string): string {
    return status === FieldVisitStatus.DONE ? 'Completada' : 'Programada';
  }
  onDeleteFieldVisit(id: number): void {
    this.store.deleteFieldVisit(id);
  }
  onFieldChange(fieldId: number): void {
    this.fieldId = fieldId;
    this.store.loadFieldVisits(fieldId);
    this.router.navigate([], { queryParams: { fieldId }, replaceUrl: true });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
