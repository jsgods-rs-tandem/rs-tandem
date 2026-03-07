import { ButtonComponent } from '@/shared/ui';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  effect,
  HostListener,
  inject,
  input,
  output,
  Renderer2,
} from '@angular/core';
import { NavService } from '@/core/services/navigation.service';
import { SidebarComponent } from '@/core/components/sidebar/sidebar.component';
import { LayoutService } from '@/core/services/layout.service';
@Component({
  selector: 'app-mobile-menu',
  imports: [ButtonComponent, SidebarComponent],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  layoutService = inject(LayoutService);
  navService = inject(NavService);
  isOpen = input<boolean>(false);
  menuToggled = output();
  constructor() {
    effect((onCleanup) => {
      if (this.isOpen()) {
        this.renderer.addClass(this.document.body, 'no-scroll');
        onCleanup(() => {
          this.renderer.removeClass(this.document.body, 'no-scroll');
        });
      }
    });
  }
  @HostListener('window:resize')
  onResize(): void {
    if (this.isOpen() && window.innerWidth > 768) {
      this.onToggle();
    }
  }
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.onToggle();
    }
  }
  onToggle(): void {
    this.menuToggled.emit();
  }
}
