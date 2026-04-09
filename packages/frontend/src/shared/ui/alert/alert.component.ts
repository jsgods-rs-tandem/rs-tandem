import { Component, computed, input } from '@angular/core';

import { IconComponent, type IconName } from '../icon';

import { Variant } from './alert.types';

@Component({
  selector: 'app-alert',
  imports: [IconComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  standalone: true,
})
export class AlertComponent {
  readonly variant = input<Variant>('info');

  protected readonly _icon = computed<IconName>(() => {
    switch (this.variant()) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'cancel';
      default:
        return 'info-outline';
    }
  });
}
