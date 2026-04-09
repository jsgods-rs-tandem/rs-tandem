import { Component, input } from '@angular/core';

import type { Color } from './code.types';

@Component({
  selector: 'app-code',
  imports: [],
  templateUrl: './code.component.html',
  styleUrl: './code.component.scss',
  standalone: true,
})
export class CodeComponent {
  color = input<Color>('primary');
}
