import { Component, inject, signal } from '@angular/core';
import { DialogueWindowComponent } from './components/dialogue-window/dialogue-window.component';
import { ChatFormComponent } from './components/chat-form/chat-form.component';
import { AiChatMockStore } from './services/ai-chat-mock.store';

@Component({
  selector: 'app-ai-chat',
  imports: [DialogueWindowComponent, ChatFormComponent],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent {
  protected readonly store = inject(AiChatMockStore);
  protected readonly username = signal('Ivan Ivanov');

  protected sendPrompt(message: string) {
    this.store.sendPrompt(message);
  }
}
