import { Component, inject } from '@angular/core';

import { ButtonComponent } from '../button/button.component';

import { BreadcrumbService } from '@/shared/services';

@Component({
  selector: 'app-breadcrumb',
  imports: [ButtonComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  standalone: true,
})
export class BreadcrumbComponent {
  readonly breadcrumbs = inject(BreadcrumbService).breadcrumbs;
}
