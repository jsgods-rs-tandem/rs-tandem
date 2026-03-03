import { HeaderComponent } from '@/core/components/header/header.component';
import { Component, signal, computed, inject } from '@angular/core';
import { ThemeService } from '@/core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public themeService = inject(ThemeService);
  isDark = computed(() => this.themeService.theme() === 'dark');
  title = 'JSGods';
  isMobileMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMobileMenuOpen.update((value) => !value);
  }
}
