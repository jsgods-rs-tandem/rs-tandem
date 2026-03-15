import { Component } from '@angular/core';

import { ButtonComponent, CardComponent, CardFooterDirective } from '@/shared/ui';

import { features } from './library.constants';

@Component({
  selector: 'app-library',
  imports: [ButtonComponent, CardComponent, CardFooterDirective],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
})
export class LibraryComponent {
  readonly features = features;
}
