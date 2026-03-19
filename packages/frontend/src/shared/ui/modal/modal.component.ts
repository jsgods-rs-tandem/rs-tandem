import { Component, computed, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../icon/Icon.types';

let nextUniqueId = 0;

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent, IconButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  title = input<string>('');
  message = input<string | string[]>('');
  buttonText = input<string>('OK');
  icon = input<IconName>('info-outline');

  protected readonly modalTitleId = `modal-title-${String(nextUniqueId++)}`;

  closed = output();

  protected isMessageArray = computed(() => Array.isArray(this.message()));
  protected messageList = computed(() => {
    const message = this.message();
    return Array.isArray(message) ? message : [];
  });

  onClose() {
    this.closed.emit();
  }
}
