import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Alert } from '../../../domain/model/alert.entity'; // Verifica tu ruta

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './alert-list.component.html',
  styleUrl: './alert-list.component.css',
})
export class AlertListComponent {
  @Input() alerts: Alert[] = [];
  @Input() isLoading: boolean = false;

  @Output() markRead = new EventEmitter<number>();
  @Output() selectAlert = new EventEmitter<number>();

  displayedColumns = ['message', 'priority', 'status', 'actions'];

  onMarkRead(id: number): void {
    this.markRead.emit(id);
  }

  onSelect(id: number): void {
    this.selectAlert.emit(id);
  }
}
