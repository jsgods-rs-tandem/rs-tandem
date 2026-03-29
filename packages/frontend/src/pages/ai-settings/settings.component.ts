import { AiSettingsComponent } from '@/features/ai-settings/ai-settings.component';
import { LineBreakComponent } from '@/shared/ui/line-break/line-break.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  imports: [AiSettingsComponent, LineBreakComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  title = 'Settings';
}
