import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';

import { ButtonComponent, CardComponent, CardFooterDirective } from '@/shared/ui';

import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

import { FEATURES_HREF_HASH } from './library.constants';

import type { i18nLibraryFeature } from './library.types';

@Component({
  selector: 'app-library',
  imports: [ButtonComponent, CardComponent, CardFooterDirective, TypedTranslocoPipe],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  standalone: true,
})
export class LibraryComponent {
  private readonly _transloco = inject(TranslocoService);

  readonly features = toSignal(
    this._transloco.selectTranslate(marker('library.features')).pipe(
      map((features) =>
        (Array.isArray(features) ? features.filter(isLibraryFeature) : []).map((feature) => ({
          heading: feature.heading,
          description: feature.description,
          href: FEATURES_HREF_HASH[feature.id],
        })),
      ),
    ),
    { initialValue: [] },
  );
}

function isLibraryFeature(value: unknown): value is i18nLibraryFeature {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'heading' in value &&
    'description' in value
  );
}
