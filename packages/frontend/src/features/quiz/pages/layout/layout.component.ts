import { Component, input } from '@angular/core';

import { BreadcrumbComponent, SpinComponent } from '@/shared/ui';

@Component({
  selector: 'app-layout',
  imports: [BreadcrumbComponent, SpinComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  loading = input<boolean>(false);
}
