import { Component, OnInit } from '@angular/core';
import { ReportStore } from '../../../application/report-store.store';
import { ReportType } from '../../../domain/model/enums/report-type.enum';
import { PriorityLevel } from '../../../domain/model/enums/priority-level.enum';
import { ReportFileComponentComponent } from '../report-file-component/report-file-component.component';
import { ReportListComponentComponent } from '../report-list-component/report-list-component.component';
import {
  RecommendationListComponentComponent
} from '../recommendation-list-component/recommendation-list-component.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-report-view-component',
  imports: [
    RecommendationListComponentComponent,
    MatIcon,
    MatButton,
    MatOption,
    MatSelect,
    FormsModule,
    MatLabel,
    MatFormField,
    ReportFileComponentComponent,
    MatDivider,
    ReportListComponentComponent,
    MatToolbar,
  ],
  templateUrl: './report-view-component.component.html',
  styleUrl: './report-view-component.component.css',
})
export class ReportViewComponentComponent implements OnInit {
  selectedType: ReportType = ReportType.FINANCIAL;
  selectedPriority: PriorityLevel = PriorityLevel.MEDIUM;

  readonly reportTypes = Object.values(ReportType);
  readonly priorities = Object.values(PriorityLevel);

  constructor(public store: ReportStore) {}

  ngOnInit(): void {
    this.store.getReports();
  }

  onGenerateReport(): void {
    this.store.generateReport(this.selectedType, 1, 1);
  }

  onSelectReport(id: number): void {
    this.store.selectReport(id);
    this.store.getRecommendations(id);
  }

  onGenerateRecommendation(): void {
    const reportId = this.store.selectedReportId();
    if (reportId !== null) {
      this.store.generateRecommendation(reportId, this.selectedPriority);
    }
  }

  onImplementRecommendation(id: number): void {
    this.store.implementRecommendation(id);
  }
}
