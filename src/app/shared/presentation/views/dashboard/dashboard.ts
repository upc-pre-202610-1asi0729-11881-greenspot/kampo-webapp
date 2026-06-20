import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService, Metric, Activity, SystemAlert } from './dashboard.service';
import { Subscription } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    MatMenuModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  metrics: Metric[] = [];
  recentActivity: Activity[] = [];
  systemAlerts: SystemAlert[] = [];
  private sub!: Subscription;

  quickAccess = [
    {
      label: 'nav.organizations',
      icon: 'corporate_fare',
      color: '#2e7d32',
      route: '/organization-management',
    },
    { label: 'nav.seasons', icon: 'eco', color: '#1565c0', route: '/season-management' },
    {
      label: 'nav.inventory',
      icon: 'inventory_2',
      color: '#e65100',
      route: '/inventory-management',
    },
    {
      label: 'nav.financial',
      icon: 'account_balance',
      color: '#6a1b9a',
      route: '/finantial-management',
    },
    { label: 'nav.reports', icon: 'bar_chart', color: '#00695c', route: '/report-management' },
    { label: 'employee.title', icon: 'people', color: '#8e24aa', route: '/employee-management' },
    {
      label: 'field_visit.title',
      icon: 'agriculture',
      color: '#ef6c00',
      route: '/field-operation',
    },
  ];

  monthlyActivity = [
    { month: 'Ene', value: 12 },
    { month: 'Feb', value: 19 },
    { month: 'Mar', value: 8 },
    { month: 'Abr', value: 24 },
    { month: 'May', value: 17 },
    { month: 'Jun', value: 30 },
  ];

  get maxActivity(): number {
    return Math.max(...this.monthlyActivity.map((m) => m.value));
  }

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.sub = this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.metrics = data.metrics;
        this.recentActivity = data.recentActivity;
        this.systemAlerts = data.systemAlerts;
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
