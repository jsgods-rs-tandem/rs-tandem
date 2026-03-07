import { FooterComponent } from '@/core/components/footer/footer.component';
import { HeaderComponent } from '@/core/components/header/header.component';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ViewportScroller, DOCUMENT } from '@angular/common';
import { getHeaderHeight } from '@/shared/services/layout.utilities';
import { LayoutService } from '@/core/services/layout.service';
import { SidebarComponent } from '@/core/components/sidebar/sidebar.component';
@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SidebarComponent, FooterComponent, RouterOutlet],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isMobileMenuOpen = signal(false);
  router = inject(Router);
  layoutService = inject(LayoutService);
  private viewportScroller = inject(ViewportScroller);
  private document = inject(DOCUMENT);

  constructor() {
    this.viewportScroller.setOffset(() => [0, getHeaderHeight(this.document)]);
  }

  toggleMenu(): void {
    this.isMobileMenuOpen.update((value) => !value);
  }
}
