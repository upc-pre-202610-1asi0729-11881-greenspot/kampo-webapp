import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Report } from '../../../domain/model/entities/report.entity';
import { MatIcon } from '@angular/material/icon';
import { MatChip } from '@angular/material/chips';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-report-list-component',
  imports: [
    MatIcon,
    MatChip,
    MatTable,
    MatProgressSpinner,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatTooltip,
    MatIconButton,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
  ],
  templateUrl: './report-list-component.component.html',
  styleUrl: './report-list-component.component.css',
})
export class ReportListComponentComponent implements OnInit {
  @Input() reports: Report[] = [];
  @Input() isLoading = false;
  @Output() selectReport = new EventEmitter<number>();

  readonly displayedColumns = ['id', 'type', 'season', 'actions'];

  ngOnInit(): void {}

  onSelect(id: number): void {
    this.selectReport.emit(id);
  }
}
