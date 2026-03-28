import { Component, effect, ElementRef, inject, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { IconButtonComponent } from '@/shared/ui';
import { AiChatStore } from '../../services/ai-chat.store';

const padding = 12;
const lineHeight = 16;
const baseTextAreaHeight = padding * 2 + lineHeight;

@Component({
  selector: 'app-chat-form',
  imports: [ReactiveFormsModule, IconButtonComponent],
  templateUrl: './chat-form.component.html',
  styleUrl: './chat-form.component.scss',
})
export class ChatFormComponent {
  readonly sendMessageEvent = output<string>();
  protected readonly store = inject(AiChatStore);
  protected messageForm = new FormGroup({
    message: new FormControl(''),
  });
  protected isActive = signal(false);
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    effect(() => {
      const status = this.store.status();
      if (status === 'error' || status === 'default') {
        this.isActive.set(true);
      } else {
        this.isActive.set(false);
        this.removeFocus();
      }
    });
  }

  protected autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${(textarea.scrollHeight - baseTextAreaHeight).toString()}px`;
  }

  protected submitOnEnter(event: Event, textarea: HTMLTextAreaElement) {
    if (event instanceof KeyboardEvent) {
      if (event.shiftKey) return;
      event.preventDefault();
      this.handleSubmit(textarea);
    }
  }

  protected handleSubmit(textarea: HTMLTextAreaElement) {
    const message = this.messageForm.value.message;
    if (this.isActive() && message?.trim()) {
      this.sendMessageEvent.emit(message);
      this.messageForm.reset();
      this.autoResize(textarea);
    }
  }

  private removeFocus() {
    const textarea = this.el.nativeElement.querySelector<HTMLTextAreaElement>('textarea');
    textarea?.blur();
  }
}
