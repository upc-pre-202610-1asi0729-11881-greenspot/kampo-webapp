import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer-content/footer.component';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { MatIconButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  imports: [
    LanguageSwitcherComponent,
    NavbarComponent,
    RouterOutlet,
    MatIcon,
    MatBadge,
    MatIconButton,
    TranslatePipe,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.component.scss',
})
export class Layout {}
