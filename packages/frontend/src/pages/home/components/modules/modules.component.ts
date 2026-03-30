import { Component } from '@angular/core';
import { ButtonComponent, CardComponent } from '@/shared/ui';
import { ROUTE_PATHS } from '@/core/constants';
import { InViewDirective } from '@/shared/directives/in-view.directive';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

@Component({
  selector: 'app-modules',
  imports: [ButtonComponent, CardComponent, InViewDirective, TypedTranslocoPipe],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.scss',
})
export class ModulesComponent {
  readonly ROUTE_PATHS = ROUTE_PATHS;
  readonly titleKey = marker('modules.title');
  readonly buttonKey = marker('modules.button');

  readonly modules = [
    {
      titleKey: marker('modules.list.basicJs.title'),
      textKey: marker('modules.list.basicJs.text'),
    },
    {
      titleKey: marker('modules.list.advancedJs.title'),
      textKey: marker('modules.list.advancedJs.text'),
    },
    {
      titleKey: marker('modules.list.algorithms.title'),
      textKey: marker('modules.list.algorithms.text'),
    },
    {
      titleKey: marker('modules.list.typescript.title'),
      textKey: marker('modules.list.typescript.text'),
    },
  ] as const;
}
