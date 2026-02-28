import { Component, input } from '@angular/core';
import { IMessage, IStreamMessage } from '../../models/llm-message-model';
import { MarkdownDirective } from '@/shared/directives/markdown.directive';

@Component({
  selector: 'app-dialogue-window',
  imports: [MarkdownDirective],
  templateUrl: './dialogue-window.component.html',
  styleUrl: './dialogue-window.component.scss',
})
export class DialogueWindowComponent {
  messages = input.required<(IMessage | IStreamMessage)[]>();
}
