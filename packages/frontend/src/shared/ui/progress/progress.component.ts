import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-progress',
  imports: [DecimalPipe, PopoverComponent],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
  standalone: true,
})
export class ProgressComponent {
  readonly id = crypto.randomUUID();
  readonly anchorId = crypto.randomUUID();

  readonly valueNow = input<number>(0);
  readonly valueMax = input.required<number>();
  readonly valueProgress = input.required<number>();
}
