import { Component, input } from '@angular/core';
import { IMessage } from '../../models/llm-message-model';

@Component({
  selector: 'app-dialogue-window',
  imports: [],
  templateUrl: './dialogue-window.component.html',
  styleUrl: './dialogue-window.component.scss',
})
export class DialogueWindowComponent {
  history = input.required<IMessage[]>();
}
