import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule, Router } from '@angular/router'; // Inyectamos Router
import { TranslateModule } from '@ngx-translate/core';
import { SeasonService } from '../../../infrastructure/services/season.service';
import { SeasonStore } from '../../../application/season.store';

@Component({
  selector: 'app-season-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './season-list.html',
  styleUrl: './season-list.css'
})
export class SeasonListComponent implements OnInit {
  private seasonService = inject(SeasonService);
  private router = inject(Router);
  public store = inject(SeasonStore);

  fieldId: number = 1;

  displayedColumns: string[] = ['id', 'fieldId', 'cropName', 'status', 'startedAt', 'actions'];

  ngOnInit(): void {
    this.loadSeasons();
  }

  loadSeasons(): void {
    this.store.loadSeasonsByField(this.fieldId);
  }

  navigateToNew(): void {
    this.router.navigate(['/season-management/new']);
  }

  view(id: number): void {
    this.router.navigate([`/season-management/view/${id}`]);
  }

  edit(id: number): void {
    this.router.navigate([`/season-management/edit/${id}`]);
  }

  deleteSeason(id: number): void {
    if (confirm('¿Deseas eliminar esta temporada?')) {
      this.seasonService.delete(id).subscribe({
        next: () => this.loadSeasons(),
        error: (err) => console.error(err)
      });
    }
  }
}
