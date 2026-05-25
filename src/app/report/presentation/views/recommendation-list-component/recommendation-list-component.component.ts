import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recommendation } from '../../../domain/model/entities/recommendation.entity';
import { RecommendationStatus } from '../../../domain/model/enums/recommendation-status.enum';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';
import { MatChip } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-recommendation-list-component',
  imports: [
    MatIcon,
    MatProgressSpinner,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatTable,
    MatChip,
    DatePipe,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatTooltip,
    MatButton,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatColumnDef,
  ],
  templateUrl: './recommendation-list-component.component.html',
  styleUrl: './recommendation-list-component.component.css',
})
export class RecommendationListComponentComponent implements OnInit {
  @Input() recommendations: Recommendation[] = [];
  @Input() isLoading = false;
  @Output() implement = new EventEmitter<number>();

  readonly RecommendationStatus = RecommendationStatus;
  readonly displayedColumns = ['id', 'priority', 'status', 'createdAt', 'actions'];

  ngOnInit(): void {}

  onImplement(id: number): void {
    this.implement.emit(id);
  }
}
