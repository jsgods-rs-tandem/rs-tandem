import { AiSettingsComponent } from '@/features/ai-settings/ai-settings.component';
import { LineBreakComponent } from '@/shared/ui/line-break/line-break.component';
import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-settings',
  imports: [AiSettingsComponent, LineBreakComponent, TranslocoPipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
