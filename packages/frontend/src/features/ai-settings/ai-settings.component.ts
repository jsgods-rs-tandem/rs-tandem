import { LineBreakComponent } from '@/shared/ui/line-break/line-break.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ai-settings',
  imports: [LineBreakComponent],
  templateUrl: './ai-settings.component.html',
  styleUrl: './ai-settings.component.scss',
})
export class AiSettingsComponent {
  title = 'AI';
}
