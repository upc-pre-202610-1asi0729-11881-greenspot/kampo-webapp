import { Component, Input, OnInit } from '@angular/core';
import { Report } from '../../../domain/model/entities/report.entity';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatChip } from '@angular/material/chips';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-report-file-component',
  imports: [
    MatCardActions,
    MatIcon,
    MatDivider,
    MatChip,
    MatProgressSpinner,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
  ],
  templateUrl: './report-file-component.component.html',
  styleUrl: './report-file-component.component.css',
})
export class ReportFileComponentComponent implements OnInit {
  @Input() report!: Report;
  @Input() isLoading = false;

  ngOnInit(): void {}

  openFile(): void {
    if (this.report?.getFileUrl()) {
      window.open(this.report.getFileUrl(), '_blank');
    }
  }
}
