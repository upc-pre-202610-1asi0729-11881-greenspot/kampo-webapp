import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';

export interface NavItem {
  labelKey: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    MatBadgeModule,
    MatRippleModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isCollapsed = false;
  isMobileOpen = false;

  navItems: NavItem[] = [
    { labelKey: 'nav.dashboard',     icon: 'dashboard',       route: '/dashboard' },
    { labelKey: 'nav.organizations', icon: 'corporate_fare',  route: '/organization-management' },
    { labelKey: 'nav.seasons',       icon: 'eco',             route: '/season-management' },
    { labelKey: 'nav.inventory',     icon: 'inventory_2',     route: '/inventory-management' },
    { labelKey: 'nav.financial',     icon: 'account_balance', route: '/finantial-management' },
    { labelKey: 'nav.reports',       icon: 'bar_chart',       route: '/report-management' },
  ];

  bottomItems: NavItem[] = [
    { labelKey: 'nav.settings', icon: 'settings', route: '/settings' },
  ];

  /** Mock user — replace with your AuthService */
  currentUser = {
    name: 'Marcus Vane',
    role: 'Agri Field Engineer',
    avatarInitials: 'MV',
  };

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (window.innerWidth < 768) {
      this.isCollapsed = true;
    }
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMobile(): void {
    this.isMobileOpen = !this.isMobileOpen;
  }

  closeMobile(): void {
    this.isMobileOpen = false;
  }
}
