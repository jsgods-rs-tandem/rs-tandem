import { Component } from '@angular/core';

import { IconComponent } from '@/shared/ui';

@Component({
  selector: 'app-alert',
  imports: [IconComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  standalone: true,
})
export class AlertComponent {
  readonly type = 'info';
}
