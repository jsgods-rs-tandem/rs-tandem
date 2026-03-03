import { FooterComponent } from '@/core/components/footer/footer.component';
import { HeaderComponent } from '@/core/components/header/header.component';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
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
