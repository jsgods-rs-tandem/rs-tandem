import { IconComponent, ButtonComponent } from '@/shared/ui';
import { Component } from '@angular/core';
import { ROUTE_PATHS } from '@/core/constants';

@Component({
  selector: 'app-hero',
  imports: [IconComponent, ButtonComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  readonly ROUTE_PATHS = ROUTE_PATHS;
  readonly title = 'Tech \n Interview';
  readonly subtitle = 'Crush Your Next';
  readonly features = [
    { icon: 'cube', text: '4 Core Modules' },
    { icon: 'code', text: 'Real-Interview Cases' },
    { icon: 'ai', text: 'Smart AI Review' },
  ] as const;
  readonly buttonText = 'Start preparation';
}
