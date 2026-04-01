import { Component, input } from '@angular/core';
import { Theme } from './line-break.types';

@Component({
  selector: 'app-line-break',
  imports: [],
  templateUrl: './line-break.component.html',
  styleUrl: './line-break.component.scss',
})
export class LineBreakComponent {
  readonly theme = input<Theme>('inert');
}
