import { IconComponent, ButtonComponent } from '@/shared/ui';
import { Component } from '@angular/core';
import { ROUTE_PATHS } from '@/core/constants';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
  selector: 'app-hero',
  imports: [IconComponent, ButtonComponent, TypedTranslocoPipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  readonly ROUTE_PATHS = ROUTE_PATHS;
  readonly titleKey = marker('hero.title');
  readonly subtitleKey = marker('hero.subtitle');
  readonly buttonKey = marker('hero.button');
  readonly features = [
    { icon: 'cube', textKey: marker('hero.features.modules') },
    { icon: 'code', textKey: marker('hero.features.cases') },
    { icon: 'ai', textKey: marker('hero.features.ai') },
  ] as const;
}
