import { SwitcherComponent } from '@/shared/switcher/switcher.component';
import { LineBreakComponent } from '@/shared/ui/line-break/line-break.component';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-ai-settings',
  imports: [LineBreakComponent, SwitcherComponent],
  templateUrl: './ai-settings.component.html',
  styleUrl: './ai-settings.component.scss',
})
export class AiSettingsComponent {
  protected title = 'AI';
  protected useRouter = signal(false);

  toggleProvider(event: boolean) {
    this.useRouter.set(event);
  }
}
