import { IconButtonComponent } from '@/shared/ui';
import { LogoComponent } from '@/shared/ui/logo/logo.component';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { HeaderMode } from './header.types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent, IconButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  mode = input<HeaderMode>('login');
  isMenuOpen = input(false);
  isDarkTheme = input(false);

  burgerClick = output();
  themeClick = output();
  languageClick = output();
}
