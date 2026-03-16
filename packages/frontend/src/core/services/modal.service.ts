import { Injectable, signal } from '@angular/core';
import { IconName } from '@/shared/ui/icon/Icon.types';

export interface ModalConfig {
  title: string;
  message: string;
  buttonText?: string;
  icon?: IconName;
  onClose?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private config = signal<ModalConfig | null>(null);

  readonly activeModal = this.config.asReadonly();

  open(config: ModalConfig): void {
    this.config.set(config);
  }

  close(): void {
    const currentConfig = this.config();

    this.config.set(null);

    if (currentConfig?.onClose) {
      currentConfig.onClose();
    }
  }
}
