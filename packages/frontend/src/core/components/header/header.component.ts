import { LogoComponent } from '@/shared/ui/logo/logo.component';
import { IconButtonComponent } from '@/shared/ui/icon-button/icon-button.component';
import { ButtonComponent } from '@/shared/ui/button/button.component';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { HeaderMode } from './header.types';
import { HEADER_ACTIONS } from './header.config';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent, IconButtonComponent, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  mode = input<HeaderMode>('login');
  isMenuOpen = input(false);
  isDarkTheme = input(false);
  isEngLanguage = input(true);

  burgerClick = output();
  themeClick = output();
  languageClick = output();
  logoutClick = output();

  actionConfig = computed(() => HEADER_ACTIONS[this.mode()]);
  langText = computed(() => (this.isEngLanguage() ? 'EN' : 'RU'));
  themeIcon = computed(() => (this.isDarkTheme() ? 'sun' : 'moon'));
}
