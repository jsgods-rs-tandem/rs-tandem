import { SwitcherComponent } from '@/shared/switcher/switcher.component';
import { InputComponent } from '@/shared/ui/input/input.component';
import { LineBreakComponent } from '@/shared/ui/line-break/line-break.component';
import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonComponent, SpinComponent } from '@/shared/ui';
import { AiHttpService } from '../ai-chat/services/ai-http-service';
import { ModalService } from '@/core/services/modal.service';
import { AiSettingsHttpService } from './ai-settings-http.service';
import { AiProviderDto, AiSettingsDto } from '@rs-tandem/shared';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectTranslate } from '@/shared/utils/translate.utilities';

interface ISettings {
  useRemoteProvider: boolean;
  provider: string;
  model: string | null;
  apiKey: string | null;
}

const initialSettings: ISettings = {
  useRemoteProvider: false,
  provider: 'open-router',
  model: null,
  apiKey: null,
};

const initialProviders: AiProviderDto[] = [
  { id: 'loading', label: 'Loading providers...', requiresKey: false },
];

@Component({
  selector: 'app-ai-settings',
  imports: [
    LineBreakComponent,
    SwitcherComponent,
    InputComponent,
    NgClass,
    ButtonComponent,
    SpinComponent,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
  templateUrl: './ai-settings.component.html',
  styleUrl: './ai-settings.component.scss',
})
export class AiSettingsComponent {
  protected providers = signal<AiProviderDto[]>(initialProviders);
  protected isLoading = signal(true);
  protected settings = signal<ISettings>(initialSettings);
  protected settingsForm = new FormGroup({
    provider: new FormControl(''),
    model: new FormControl(''),
    apiKey: new FormControl(''),
  });

  private chatHistoryAPI = inject(AiHttpService);
  private settingsAPI = inject(AiSettingsHttpService);
  private modal = inject(ModalService);
  private readonly t = injectTranslate();

  constructor() {
    this.loadProviders();
    this.loadSettings();
  }

  protected handleSubmit() {
    let newSettings: AiSettingsDto;
    if (!this.settings().useRemoteProvider) {
      newSettings = {
        providerId: 'ollama',
        model: null,
        apiKey: null,
      };
      this.saveSettings(newSettings);
    } else {
      const formValue = this.settingsForm.value;
      let model = formValue.model;
      if (model === '' || model === null || model === undefined) {
        model = this.settings().model;
      }
      let apiKey = formValue.apiKey;
      if (apiKey === '' || apiKey === null || apiKey === undefined) {
        apiKey = this.settings().apiKey;
      }
      newSettings = {
        providerId: formValue.provider ?? '',
        model,
        apiKey,
      };
      if (this.isValidData(newSettings)) this.saveSettings(newSettings);
    }
  }

  private saveSettings(settings: AiSettingsDto) {
    this.settingsAPI.updateMySettings(settings).subscribe({
      next: () => {
        this.updateSettings(settings);
        this.modal.open({
          title: this.t('settings.ai.modal.settingsUpdateSucces.title'),
          message: this.t('settings.ai.modal.settingsUpdateSucces.message'),
          buttonText: 'OK',
        });
      },
      error: (error: unknown) => {
        console.error('Error updating AI settings:', error);
        this.modal.open({
          title: this.t('settings.ai.modal.settingsUpdateError.title'),
          message: this.t('settings.ai.modal.settingsUpdateError.message'),
          buttonText: 'OK',
        });
      },
    });
  }

  private loadProviders() {
    this.settingsAPI.getProviders().subscribe({
      next: (providers) => {
        this.updateProviders(providers);
      },
      error: (error: unknown) => {
        console.error('Error fetching AI providers:', error);
        this.providers.set([
          { id: 'error', label: 'Failed to load providers', requiresKey: false },
        ]);
        this.modal.open({
          title: this.t('settings.ai.modal.loadProvidersError.title'),
          message: this.t('settings.ai.modal.loadProvidersError.message'),
          buttonText: 'OK',
        });
      },
    });
  }

  private loadSettings() {
    this.settingsAPI.getMySettings().subscribe({
      next: (settings) => {
        this.updateSettings(settings);
        this.isLoading.set(false);
        this.settingsForm.setValue({
          provider: settings.providerId,
          model: settings.model ?? '',
          apiKey: settings.apiKey ?? '',
        });
      },
      error: (error: unknown) => {
        console.error('Error fetching AI settings:', error);
        this.isLoading.set(false);
        this.modal.open({
          title: this.t('settings.ai.modal.errorLoadSettings.title'),
          message: this.t('settings.ai.modal.errorLoadSettings.message'),
          buttonText: 'OK',
        });
      },
    });
  }

  private updateProviders(providers: AiProviderDto[]) {
    this.providers.set(providers.filter((provider) => provider.id !== 'ollama'));
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
          title: this.t('settings.ai.modal.resetHistorySucces.title'),
          message: this.t('settings.ai.modal.resetHistorySucces.message'),
          buttonText: 'OK',
        });
      },
      error: (error: unknown) => {
        console.error('Error resetting chat history:', error);
        this.modal.open({
          title: this.t('settings.ai.modal.resetHistoryError.title'),
          message: this.t('settings.ai.modal.resetHistoryError.message'),
          buttonText: 'OK',
        });
      },
    });
  }

  private isValidData(settings: AiSettingsDto): boolean {
    if (!settings.providerId) {
      this.showValidationError('Provider');
      return false;
    }
    if (!settings.model && !this.settings().model) {
      this.showValidationError('Model');
      return false;
    }
    if (!settings.apiKey && !this.settings().apiKey) {
      this.showValidationError('API Key');
      return false;
    }
    return true;
  }

  private showValidationError(field: string) {
    this.modal.open({
      title: this.t('settings.ai.modal.validationError.title'),
      message: `${this.t('settings.ai.modal.validationError.startOfMessage')} "${field}" ${this.t('settings.ai.modal.validationError.endOfMessage')}`,
      buttonText: 'OK',
    });
  }
}
