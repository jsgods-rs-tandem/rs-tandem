import { SwitcherComponent } from '@/shared/switcher/switcher.component';
import { InputComponent } from '@/shared/ui/input/input.component';
import { LineBreakComponent } from '@/shared/ui/line-break/line-break.component';
import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonComponent } from '@/shared/ui';

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

  toggleProvider(event: boolean) {
    this.useRemoteProvider.set(event);
  }
}
