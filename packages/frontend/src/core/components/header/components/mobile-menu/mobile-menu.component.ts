import { ButtonComponent } from '@/shared/ui';
import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-mobile-menu',
  imports: [ButtonComponent],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
  isOpen = input<boolean>(false);
  menuToggled = output();

  @HostListener('window:resize')
  onResize(): void {
    if (this.isOpen() && window.innerWidth > 768) {
      this.onToggle();
    }
  }
  onToggle(): void {
    this.menuToggled.emit();
  }
}
