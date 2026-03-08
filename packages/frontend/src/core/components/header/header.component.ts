import { LogoComponent } from '@/shared/ui/logo/logo.component';
import { IconButtonComponent } from '@/shared/ui/icon-button/icon-button.component';
import { ButtonComponent } from '@/shared/ui/button/button.component';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import type { HeaderMode } from './header.types';
import { HEADER_ACTIONS } from './header.config';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { NgTemplateOutlet } from '@angular/common';
import { ThemeService } from '@/core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LogoComponent,
    IconButtonComponent,
    ButtonComponent,
    MobileMenuComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  mode = input<HeaderMode>('login');
  isMenuOpen = input(false);
  isDarkTheme = computed(() => this.themeService.theme() === 'dark');
  isEngLanguage = input(true);

  menuToggled = output();
  languageClick = output();
  logoutClick = output();

  actionConfig = computed(() => HEADER_ACTIONS[this.mode()]);
  langText = computed(() => (this.isEngLanguage() ? 'EN' : 'RU'));
  themeIcon = computed(() => (this.isDarkTheme() ? 'sun' : 'moon'));
  themeAriaLabel = computed(() =>
    this.isDarkTheme() ? 'Switch to light theme' : 'Switch to dark theme',
  );
  languageAriaLabel = computed(() =>
    this.isEngLanguage() ? 'Switch to Russian language' : 'Switch to English language',
  );

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
