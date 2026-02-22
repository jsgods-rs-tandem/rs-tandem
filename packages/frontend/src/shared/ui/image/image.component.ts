import { Component, input } from '@angular/core';

import type { Loading, FetchPriority } from './image.types';

@Component({
  selector: 'app-image',
  imports: [],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent {
  src = input.required<string>();
  alt = input<string | undefined>(' ');
  width = input<string | undefined>();
  height = input<string | undefined>();
  loading = input<Loading | undefined>();
  fetchPriority = input<FetchPriority | undefined>();
}
