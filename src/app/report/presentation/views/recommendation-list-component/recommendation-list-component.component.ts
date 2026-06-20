import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recommendation } from '../../../domain/model/entities/recommendation.entity';
import { RecommendationStatus } from '../../../domain/model/enums/recommendation-status.enum';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-recommendation-list-component',
  imports: [MatIcon, MatProgressSpinner],
  templateUrl: './recommendation-list-component.component.html',
  styleUrl: './recommendation-list-component.component.css',
})
export class RecommendationListComponentComponent implements OnInit {
  @Input() recommendations: Recommendation[] = [];
  @Input() isLoading = false;
  @Output() implement = new EventEmitter<number>();

  readonly RecommendationStatus = RecommendationStatus;

  // Nota: Esta variable ya no se usa visualmente en el HTML, pero la mantenemos para no alterar tu lógica interna
  readonly displayedColumns = ['id', 'priority', 'status', 'createdAt', 'actions'];
  protected rec: any;

  ngOnInit(): void {}

  onImplement(id: number): void {
    this.implement.emit(id);
  }
}
