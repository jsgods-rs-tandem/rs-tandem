import { Component, computed, input } from '@angular/core';
import type { ButtonType } from '@/shared/types';
import { IconComponent } from '../icon/icon.component';
import { RouterLink } from '@angular/router';
import { ButtonVersion } from './button.types';
import { IconColor, IconName } from '../icon/Icon.types';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [NgTemplateOutlet, IconComponent, RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  type = input<ButtonType>('button');
  version = input<ButtonVersion>('primary');
  text = input<string>('');
  icon = input<IconName>();
  iconColor = input<IconColor>('secondary');
  iconPosition = input<'start' | 'end'>('start');
  /** for Angular Router */
  link = input<string>();
  fragment = input<string>();
  /** for links like GitHub*/
  href = input<string>();
  /** Open link in a new tab if true.*/
  external = input<boolean>(false);
  disabled = input<boolean>(false);
  ariaLabel = input<string>('');
  isSmallButton = input<boolean>(false);
  displayAriaLabel = computed(() => this.ariaLabel() || this.text());
  classes = computed(() => {
    return [
      'button',
      `button_${this.version()}`,
      `button_icon-${this.iconPosition()}`,
      this.isSmallButton() ? 'button_size_s' : null,
    ]
      .filter(Boolean)
      .join(' ');
  });
}
