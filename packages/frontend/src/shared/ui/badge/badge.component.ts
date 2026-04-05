import { Component, input } from '@angular/core';

import { PopoverComponent } from '../popover';

import type { FontWeight, Shape, Color } from './badge.types';

@Component({
  selector: 'app-badge',
  imports: [PopoverComponent],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  standalone: true,
})
export class BadgeComponent {
  readonly text = input.required<string>();
  readonly fontWeight = input<FontWeight>('normal');
  readonly shape = input<Shape>('rectangle');
  readonly color = input.required<Color>();

  readonly popoverContent = input<string>();
  readonly id = crypto.randomUUID();
  readonly anchorId = crypto.randomUUID();
}
