import { FooterComponent } from '@/core/components/footer/footer.component';
import { HeaderComponent } from '@/core/components/header/header.component';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ViewportScroller, DOCUMENT } from '@angular/common';
import { getHeaderHeight } from '@/shared/services/layout.utilities';
import { LayoutService } from '@/core/services/layout.service';
import { ModalService } from '@/core/services/modal.service';
import { SidebarComponent } from '@/core/components/sidebar/sidebar.component';
import { ModalComponent } from '@/shared/ui/modal/modal.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SidebarComponent, FooterComponent, RouterOutlet, ModalComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected modalService = inject(ModalService);

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
