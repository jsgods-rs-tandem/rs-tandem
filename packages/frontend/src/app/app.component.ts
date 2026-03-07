import { FooterComponent } from '@/core/components/footer/footer.component';
import { HeaderComponent } from '@/core/components/header/header.component';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUpComponent } from '@/pages/sign-up/sign-up.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, FooterComponent, RouterOutlet, SignUpComponent],
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
