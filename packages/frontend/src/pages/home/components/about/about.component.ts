import { Component } from '@angular/core';
import { ButtonComponent } from '@/shared/ui';
import { ROUTE_PATHS } from '@/core/constants';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

@Component({
  selector: 'app-about',
  imports: [ButtonComponent, TypedTranslocoPipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly ROUTE_PATHS = ROUTE_PATHS;
}
