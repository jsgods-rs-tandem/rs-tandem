import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DialogueWindowComponent } from './components/dialogue-window/dialogue-window.component';
import { ChatFormComponent } from './components/chat-form/chat-form.component';
import { AiChatStore } from './services/ai-chat.store';
import { AuthStore } from '@/core/store/auth.store';
import { SpinComponent } from '@/shared/ui';

@Component({
  selector: 'app-ai-chat',
  imports: [DialogueWindowComponent, ChatFormComponent, SpinComponent],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent implements OnInit, OnDestroy {
  protected readonly store = inject(AiChatStore);
  protected readonly username = inject(AuthStore).name;
  protected readonly isLoaded = signal(false);

  constructor() {
    effect(() => {
      if (this.store.status() === 'loading') {
        this.isLoaded.set(false);
      } else {
        this.isLoaded.set(true);
      }
    });
  }

  ngOnInit(): void {
    this.store.initSocketListeners();
  }

  ngOnDestroy(): void {
    this.store.destroySocketListeners();
  }
  protected sendPrompt(message: string) {
    this.store.sendPrompt(message);
  }
}
