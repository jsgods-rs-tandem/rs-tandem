import { Component, input, model, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-accordion-item',
  imports: [ButtonComponent],
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItemComponent {
  title = input.required<string>();
  description = input.required<string>();
  isOpen = model<boolean>(false);

  private readonly instanceId = crypto.randomUUID();

  protected readonly headerId = `${this.instanceId}-header`;
  protected readonly contentId = `${this.instanceId}-content`;

  toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
