import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SeasonStore } from '../../../application/season.store';

/**
 * NOTA: el backend real no tiene DELETE /seasons/{id} — las temporadas
 * no se eliminan, solo avanzan de estado o se finalizan (ver SeasonDetail).
 */
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
    TranslateModule,
  ],
  templateUrl: './season-list.html',
  styleUrl: './season-list.css',
})
export class SeasonListComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public store = inject(SeasonStore);

  fieldId: number = 1;

  displayedColumns: string[] = ['id', 'fieldId', 'cropName', 'status', 'startedAt', 'actions'];

  ngOnInit(): void {
    const fieldIdParam = this.route.snapshot.queryParamMap.get('fieldId');
    this.fieldId = fieldIdParam ? Number(fieldIdParam) : 1;
    this.loadSeasons();
  }

  loadSeasons(): void {
    this.store.loadSeasonsByField(this.fieldId);
  }

  navigateToNew(): void {
    this.router.navigate(['/season-management/new'], { queryParams: { fieldId: this.fieldId } });
  }

  view(id: number): void {
    this.router.navigate([`/season-management/view/${id}`]);
  }
}
