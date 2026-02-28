import { Component, effect, ElementRef, inject } from '@angular/core';
import { MarkdownDirective } from '@/shared/directives/markdown.directive';
import { AiChatMockStore } from '../../services/ai-chat-mock.store';

@Component({
  selector: 'app-dialogue-window',
  imports: [MarkdownDirective],
  templateUrl: './dialogue-window.component.html',
  styleUrl: './dialogue-window.component.scss',
})
export class DialogueWindowComponent {
  protected readonly store = inject(AiChatMockStore);
  private prevLength = this.store.messagesLength();
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    effect(() => {
      if (this.prevLength !== this.store.messagesLength()) {
        this.scrollToDown();
        this.prevLength = this.store.messagesLength();
      }
    });
  }

  private scrollToDown() {
    const element = this.host.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
}
