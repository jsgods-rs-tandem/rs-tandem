import { Component, signal } from '@angular/core';
import { DialogueWindowComponent } from './components/dialogue-window/dialogue-window.component';
import { ChatFormComponent } from './components/chat-form/chat-form.component';

@Component({
  selector: 'app-ai-chat',
  imports: [DialogueWindowComponent, ChatFormComponent],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent {
  username = signal('Ivan Ivanov');
  history = signal([]);
}
