import { Component, effect, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { AiChatMockStore } from '../../services/ai-chat-mock.store';

const padding = 12;
const lineHeight = 16;
const baseTextAreaHeight = padding * 2 + lineHeight;

@Component({
  selector: 'app-chat-form',
  imports: [ReactiveFormsModule],
  templateUrl: './chat-form.component.html',
  styleUrl: './chat-form.component.scss',
})
export class ChatFormComponent {
  readonly sendMessageEvent = output<string>();
  protected readonly store = inject(AiChatMockStore);
  protected messageForm = new FormGroup({
    message: new FormControl(''),
  });
  protected isActive = false;

  constructor() {
    effect(() => {
      if (this.store.status() !== 'pending' && this.store.status() !== 'typing') {
        this.isActive = true;
      } else {
        this.isActive = false;
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
    if (this.isActive && message?.trim()) {
      this.sendMessageEvent.emit(message);
      this.messageForm.reset();
      this.autoResize(textarea);
    }
  }
}
