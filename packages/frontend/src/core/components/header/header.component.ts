import { LogoComponent } from '@/shared/ui/logo/logo.component';
import { IconButtonComponent } from '@/shared/ui/icon-button/icon-button.component';
import { ButtonComponent } from '@/shared/ui/button/button.component';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import type { HeaderMode } from './header.types';
import { HEADER_ACTIONS } from './header.config';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { NgTemplateOutlet } from '@angular/common';
import { ThemeService } from '@/core/services/theme.service';
import { Router } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';
import { ROUTE_PATHS } from '@/core/constants';
import { TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { saveLang } from '@/core/utils/i18n.utils';
import { AppLanguage } from '@/core/constants/i18n.constants';

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
  private authService = inject(AuthService);
  private translocoService = inject(TranslocoService);
  private router = inject(Router);
  mode = input<HeaderMode>('login');
  isMenuOpen = input(false);
  isDarkTheme = computed(() => this.themeService.theme() === 'dark');
  activeLang = toSignal(this.translocoService.langChanges$, {
    initialValue: this.translocoService.getActiveLang() as AppLanguage,
  });

  menuToggled = output();
  languageClick = output();

  actionConfig = computed(() => HEADER_ACTIONS[this.mode()]);
  isEngLanguage = computed(() => this.activeLang() === 'en');
  langText = computed(() => (this.isEngLanguage() ? 'Ru' : 'En'));
  themeIcon = computed(() => (this.isDarkTheme() ? 'sun' : 'moon'));
  themeAriaLabel = computed(() =>
    this.isDarkTheme() ? 'Switch to light theme' : 'Switch to dark theme',
  );
  languageAriaLabel = computed(() =>
    this.isEngLanguage() ? 'Switch to Russian language' : 'Switch to English language',
  );
  // change ROUTE_PATHS.library to ROUTE_PATHS.dashboard when available
  readonly logoLink = computed(() =>
    this.authService.isAuthenticated() ? ROUTE_PATHS.library : ROUTE_PATHS.home,
  );

  readonly logoAriaLabel = computed(() =>
    this.authService.isAuthenticated() ? 'Go to the library' : 'Go to the home page',
  );

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    const newLang = this.isEngLanguage() ? 'ru' : 'en';

    this.translocoService.setActiveLang(newLang);
    saveLang(newLang);
  }

  handleLogout(): void {
    this.authService.logout();
    void this.router.navigate([ROUTE_PATHS.home]);
  }
}
