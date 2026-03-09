import { Component, input, output } from '@angular/core';

import { AnswerStatus } from './answer-tile.constants';

@Component({
  selector: 'app-answer-tile',
  imports: [],
  templateUrl: './answer-tile.component.html',
  styleUrl: './answer-tile.component.scss',
  standalone: true,
})
export class AnswerTileComponent {
  readonly name = input.required<string>();
  readonly value = input.required<string>();
  readonly status = input<AnswerStatus>();
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  valueEvent = output<string>();

  onInput() {
    this.valueEvent.emit(this.value());
  }
}
