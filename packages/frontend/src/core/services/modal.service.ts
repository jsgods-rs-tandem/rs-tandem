import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { IconName } from '@/shared/ui/icon/Icon.types';

export interface ModalConfig {
  title: string;
  message: string | string[];
  buttonText?: string;
  icon?: IconName;
  onClose?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private config = signal<ModalConfig | null>(null);
  private router = inject(Router);

  readonly activeModal = this.config.asReadonly();

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.dismiss();
    });
  }

  open(config: ModalConfig): void {
    this.config.set(config);
  }

  close(): void {
    const currentConfig = this.config();
    this.config.set(null);
    currentConfig?.onClose?.();
  }

  dismiss(): void {
    this.config.set(null);
  }
}
