import { Component, computed, input } from '@angular/core';
import type { ButtonType } from '@/shared/types';
import { IconComponent } from '../icon/icon.component';
import { RouterModule } from '@angular/router';
import { ButtonVersion } from './button.types';
import { IconColor, IconName } from '../icon/Icon.types';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [NgTemplateOutlet, IconComponent, RouterModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  type = input<ButtonType>('button');
  version = input<ButtonVersion>('primary');
  text = input<string>('');
  icon = input<IconName>();
  iconColor = input<IconColor>('secondary');
  // FYI: for Angular Router
  link = input<string>();
  // FYI: for links like GitHub or #about
  href = input<string>();
  // FYI: Open link in a new tab if true.
  external = input<boolean>(false);
  disabled = input<boolean>(false);
  ariaLabel = input<string>('');
  displayAriaLabel = computed(() => this.ariaLabel() || this.text());
  classes = computed(() => `button button_${this.version()}`);
}
