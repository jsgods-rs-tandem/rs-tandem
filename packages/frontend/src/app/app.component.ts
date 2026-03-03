import { HeaderComponent } from '@/core/components/header/header.component';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'JSGods';
  isMobileMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMobileMenuOpen.update((value) => !value);
  }
}
