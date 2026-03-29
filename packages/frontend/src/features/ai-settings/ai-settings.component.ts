import { SwitcherComponent } from '@/shared/switcher/switcher.component';
import { InputComponent } from '@/shared/ui/input/input.component';
import { LineBreakComponent } from '@/shared/ui/line-break/line-break.component';
import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '@/shared/ui';
import { AiHttpService } from '../ai-chat/services/ai-http-service';
import { ModalService } from '@/core/services/modal.service';

const mockProviders = [
  {
    label: 'Open Router',
    value: 'open-router',
  },
  {
    label: 'OpenAI',
    value: 'openai',
  },
  {
    label: 'Gemini',
    value: 'gemini',
  },
];

const mockProviderSettings = {
  provider: {
    label: 'Open Router',
    value: 'open-router',
  },
  model: 'gpt-4o',
  apiKey: '21984uhrfsdfhuh8hfuhefshdfsihfiuhdfuihadf',
};

@Component({
  selector: 'app-ai-settings',
  imports: [LineBreakComponent, SwitcherComponent, InputComponent, NgClass, ButtonComponent],
  templateUrl: './ai-settings.component.html',
  styleUrl: './ai-settings.component.scss',
})
export class AiSettingsComponent {
  protected title = 'AI';
  protected providers = mockProviders;
  protected useRemoteProvider = signal(false);
  protected providerSettings = signal(mockProviderSettings);
  private chatHistoryAPI = inject(AiHttpService);
  private modal = inject(ModalService);

  toggleProvider(event: boolean) {
    this.useRemoteProvider.set(event);
  }

  protected resetChatHistory() {
    this.chatHistoryAPI.deleteHistory().subscribe({
      next: () => {
        this.modal.open({
          title: 'Chat History Reset',
          message: 'Your chat history has been successfully reset.',
          buttonText: 'OK',
        });
      },
      error: (error: unknown) => {
        console.error('Error resetting chat history:', error);
        this.modal.open({
          title: 'Error',
          message: 'Failed to reset chat history. Please try again.',
          buttonText: 'OK',
        });
      },
    });
  }
}
