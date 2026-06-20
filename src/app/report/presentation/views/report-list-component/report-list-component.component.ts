import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Report } from '../../../domain/model/entities/report.entity';
import { MatIcon } from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-report-list-component',
  imports: [
    MatIcon,
    MatTable,
    MatProgressSpinner,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
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
  @Output() deleteReport = new EventEmitter<number | string>();
  readonly displayedColumns = ['id', 'type', 'season', 'actions'];

  ngOnInit(): void {}

  onSelect(id: number): void {
    this.selectReport.emit(id);
  }

  onDelete(id: number | string): void {
    this.deleteReport.emit(id);
  }
}
