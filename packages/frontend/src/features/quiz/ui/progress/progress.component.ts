import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-progress',
  imports: [DecimalPipe],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
  standalone: true,
})
export class ProgressComponent {
  readonly start = input<number>(0);
  readonly end = input.required<number>();
}
