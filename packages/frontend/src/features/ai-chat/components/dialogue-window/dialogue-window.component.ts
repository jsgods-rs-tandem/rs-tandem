import { Component, effect, ElementRef, inject } from '@angular/core';
import { MarkdownDirective } from '@/shared/directives/markdown.directive';
import { ChatStatus } from '../../models/ai-chat-status';
import { AiChatStore } from '../../services/ai-chat.store';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-dialogue-window',
  imports: [MarkdownDirective, TranslocoPipe],
  templateUrl: './dialogue-window.component.html',
  styleUrl: './dialogue-window.component.scss',
})
export class DialogueWindowComponent {
  protected readonly store = inject(AiChatStore);
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

  protected onMDStatusChange(status: ChatStatus) {
    this.store.updateStatus(status);
  }

  private scrollToDown() {
    const element = this.host.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
}
