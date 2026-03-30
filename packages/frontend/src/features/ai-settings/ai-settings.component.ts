import { SwitcherComponent } from '@/shared/switcher/switcher.component';
import { InputComponent } from '@/shared/ui/input/input.component';
import { LineBreakComponent } from '@/shared/ui/line-break/line-break.component';
import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonComponent, SpinComponent } from '@/shared/ui';
import { AiHttpService } from '../ai-chat/services/ai-http-service';
import { ModalService } from '@/core/services/modal.service';
import { AiSettingsHttpService } from './ai-settings-http.service';
import { AiSettingsDto } from '@rs-tandem/shared';

interface ISettings {
  useRemoteProvider: boolean;
  provider: string;
  model: string | null;
  apiKey: string | null;
}
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

const initialSettings: ISettings = {
  useRemoteProvider: false,
  provider: 'open-router',
  model: null,
  apiKey: null,
};

@Component({
  selector: 'app-ai-settings',
  imports: [
    LineBreakComponent,
    SwitcherComponent,
    InputComponent,
    NgClass,
    ButtonComponent,
    SpinComponent,
  ],
  templateUrl: './ai-settings.component.html',
  styleUrl: './ai-settings.component.scss',
})
export class AiSettingsComponent {
  protected title = 'AI';
  protected providers = mockProviders;
  protected isLoading = signal(true);
  protected settings = signal<ISettings>(initialSettings);

  private chatHistoryAPI = inject(AiHttpService);
  private settingsAPI = inject(AiSettingsHttpService);
  private modal = inject(ModalService);

  constructor() {
    this.settingsAPI.getMySttings().subscribe({
      next: (settings) => {
        this.updateSettings(settings);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('Error fetching AI settings:', error);
        this.isLoading.set(false);
        this.modal.open({
          title: 'Error',
          message: 'Failed to load AI settings',
          buttonText: 'OK',
        });
      },
    });
  }

  private updateSettings(settings: AiSettingsDto) {
    this.settings.set({
      useRemoteProvider: settings.providerId !== 'ollama',
      provider: settings.providerId,
      model: settings.model,
      apiKey: settings.apiKey,
    });
  }

  toggleProvider(event: boolean) {
    this.settings.update((current) => ({ ...current, useRemoteProvider: event }));
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
