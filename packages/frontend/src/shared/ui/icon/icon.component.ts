import { Component, input } from '@angular/core';

import type { IconName, IconSize, IconColor } from './Icon.types';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  standalone: true,
})
export class IconComponent {
  name = input.required<IconName>();
  size = input<IconSize>('m');
  color = input<IconColor>('neutral');

  private readonly _spritePath = '@/assets/icons/sprite.svg';

  get href(): string {
    return `${this._spritePath}#${this.name()}`;
  }
}
