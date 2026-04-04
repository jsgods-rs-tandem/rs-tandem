import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DialogueWindowComponent } from './components/dialogue-window/dialogue-window.component';
import { ChatFormComponent } from './components/chat-form/chat-form.component';
import { AiChatStore } from './services/ai-chat.store';
import { AuthStore } from '@/core/store/auth.store';
import { SpinComponent } from '@/shared/ui';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-ai-chat',
  imports: [DialogueWindowComponent, ChatFormComponent, SpinComponent, TranslocoPipe],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent implements OnInit, OnDestroy {
  protected readonly store = inject(AiChatStore);
  protected readonly username = inject(AuthStore).name;

  ngOnInit(): void {
    this.store.initSocketListeners();
    this.store.loadHistory();
  }

  ngOnDestroy(): void {
    this.store.destroySocketListeners();
  }
  protected sendPrompt(message: string) {
    this.store.sendPrompt(message);
  }
}
