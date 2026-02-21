import { Component, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

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

  messageForm = new FormGroup({
    message: new FormControl(''),
  });

  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${(textarea.scrollHeight - baseTextAreaHeight).toString()}px`;
  }

  submitOnEnter(event: Event, textarea: HTMLTextAreaElement) {
    if (event instanceof KeyboardEvent) {
      if (event.shiftKey) return;
      event.preventDefault();
      this.handleSubmit(textarea);
    }
  }

<<<<<<< HEAD
  handleSubmit(textarea: HTMLTextAreaElement) {
=======
  submitOnEnter(event: Event) {
    if (event instanceof KeyboardEvent) {
      if (event.shiftKey) return;
      event.preventDefault();
      this.handleSubmit();
    }
  }

  handleSubmit() {
>>>>>>> c93a5ca (feat: implement submiting form by pressing Enter)
    const message = this.messageForm.value.message;
    if (message?.trim()) {
      this.sendMessageEvent.emit(message);
      this.messageForm.reset();
      this.autoResize(textarea);
    }
  }
}
