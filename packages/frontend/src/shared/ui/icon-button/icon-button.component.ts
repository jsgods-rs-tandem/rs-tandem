import { Component, input } from '@angular/core';

import { IconComponent } from '../icon/icon.component';

import type { ButtonType } from '@/shared/types';

@Component({
  selector: 'app-icon-button',
  imports: [IconComponent],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
  type = input<ButtonType>('button');
  icon = input.required<ReturnType<IconComponent['name']>>();
  color = input<ReturnType<IconComponent['color']>>('neutral');
  ariaLabel = input<string>();
}
