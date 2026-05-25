import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { FieldOperationStore } from '../../../application/field-operation.store';
import { Severity } from '../../../domain/model/enums/severity.enum';
import { FieldVisit } from '../../../domain/model/entities/field-visit.entity';

@Component({
  selector: 'app-observation-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule, DatePipe],
  templateUrl: './observation-detail.html',
  styleUrls: ['./observation-detail.css']
})
export class ObservationDetailComponent implements OnInit {
  public store = inject(FieldOperationStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  fieldVisit: FieldVisit | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.fieldVisit = this.store.getFieldVisitById(+id) ?? null;
      if (!this.fieldVisit) {
        const fvId = this.route.snapshot.queryParamMap.get('fieldId');
        const fieldId = fvId ? Number(fvId) : 1;
        this.store.loadFieldVisits(fieldId);
      }
    }
  }

  showPestSeverity(severity: string): string {
    const labels: Record<string, string> = {
      [Severity.LOW]: 'Baja',
      [Severity.MEDIUM]: 'Media',
      [Severity.HIGH]: 'Alta',
      [Severity.CRITICAL]: 'Crítica'
    };
    return labels[severity] ?? severity;
  }

  showDiseaseSeverity(severity: string): string {
    return this.showPestSeverity(severity);
  }

  onAddObservation(): void {
    if (!this.fieldVisit) return;
    this.router.navigate(['/field-operation/observations/new'], {
      queryParams: { fieldVisitId: this.fieldVisit.getId() }
    });
  }

  back(): void {
    const fieldId = this.fieldVisit?.getFieldId() ?? 1;
    this.router.navigate(['/field-operation'], { queryParams: { fieldId } });
  }
}
