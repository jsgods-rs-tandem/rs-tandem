import { Component, inject, input, output } from '@angular/core';
import { ButtonComponent } from '@/shared/ui';
import { ScrollSpyService } from '@/shared/services/scroll-spy.service';
import { NavLink } from './navigation.types';

@Component({
  selector: 'app-navigation',
  imports: [ButtonComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  links = input.required<NavLink[]>();
  linkClicked = output();
  scrollSpy = inject(ScrollSpyService);
  onAnchorClick(path: string) {
    this.scrollSpy.setAnchorManually(path);
    this.linkClicked.emit();
  }
}
