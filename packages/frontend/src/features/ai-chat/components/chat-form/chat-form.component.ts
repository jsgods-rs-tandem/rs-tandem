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

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${(textarea.scrollHeight - baseTextAreaHeight).toString()}px`;
  }

  handleSubmit() {
    const message = this.messageForm.value.message;
    if (message?.trim()) {
      this.sendMessageEvent.emit(message);
      this.messageForm.reset();
    }
  }
}
