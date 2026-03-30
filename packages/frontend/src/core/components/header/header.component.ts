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
import { saveLanguage } from '@/core/utils/i18n.utils';
import { injectActiveLang } from '@/shared/utils/translate.utilities';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LogoComponent,
    IconButtonComponent,
    ButtonComponent,
    MobileMenuComponent,
    NgTemplateOutlet,
    TypedTranslocoPipe,
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
  private activeLang = injectActiveLang();
  mode = input<HeaderMode>('login');
  isMenuOpen = input(false);
  isDarkTheme = computed(() => this.themeService.theme() === 'dark');

  menuToggled = output();
  languageClick = output();

  actionConfig = computed(() => HEADER_ACTIONS[this.mode()]);
  isEngLanguage = computed(() => this.activeLang() === 'en');
  languageText = computed(() => (this.isEngLanguage() ? 'Ru' : 'En'));
  themeIcon = computed(() => (this.isDarkTheme() ? 'sun' : 'moon'));
  themeAriaLabel = computed(() =>
    this.isDarkTheme() ? marker('header.aria.themeLight') : marker('header.aria.themeDark'),
  );

  languageAriaLabel = computed(() =>
    this.isEngLanguage() ? marker('header.aria.langRu') : marker('header.aria.langEn'),
  );

  readonly logoLink = computed(() =>
    this.authService.isAuthenticated() ? ROUTE_PATHS.library : ROUTE_PATHS.home,
  );

  logoAriaLabel = computed(() =>
    this.authService.isAuthenticated()
      ? marker('header.aria.logoLibrary')
      : marker('header.aria.logoHome'),
  );

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    const newLanguage = this.isEngLanguage() ? 'ru' : 'en';

    this.translocoService.setActiveLang(newLanguage);
    saveLanguage(newLanguage);
  }

  handleLogout(): void {
    this.authService.logout();
    void this.router.navigate([ROUTE_PATHS.home]);
  }
}
