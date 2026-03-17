import { Component, input } from '@angular/core';

@Component({
  selector: 'app-popover',
  imports: [],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
  standalone: true,
})
export class PopoverComponent {
  readonly id = input.required<string>();
  readonly anchorId = input.required<string>();
}
