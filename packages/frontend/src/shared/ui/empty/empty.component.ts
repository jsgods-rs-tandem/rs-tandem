import { Component, input } from '@angular/core';

import type { HeadingLevel } from './empty.types';

@Component({
  selector: 'app-empty',
  imports: [],
  templateUrl: './empty.component.html',
  styleUrl: './empty.component.scss',
  standalone: true,
})
export class EmptyComponent {
  heading = input.required<string>();
  headingLevel = input<HeadingLevel>(2);
  description = input.required<string>();
}
