import { Component, input } from '@angular/core';

import type { Size, Theme } from './spin.types';

@Component({
  selector: 'app-spin',
  imports: [],
  templateUrl: './spin.component.html',
  styleUrl: './spin.component.scss',
  standalone: true,
})
export class SpinComponent {
  readonly size = input<Size>('medium');
  readonly theme = input<Theme>('dark');
}
