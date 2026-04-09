import { Component, effect, inject, type OnInit } from '@angular/core';

import { LayoutComponent } from '@/pages/layout';
import { ButtonComponent, CategoryCardListComponent, EmptyComponent } from '@/shared/ui';

import { ChallengesService } from '../../services';

import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

import { injectActiveLang } from '@/shared/utils/translate.utilities';

@Component({
  selector: 'app-categories-page',
  host: {
    'collision-id': 'challenges-categories-page',
  },
  imports: [
    ButtonComponent,
    CategoryCardListComponent,
    EmptyComponent,
    LayoutComponent,
    TypedTranslocoPipe,
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
  standalone: true,
})
export class CategoriesPageComponent implements OnInit {
  readonly challengesService = inject(ChallengesService);
  private readonly _activeLang = injectActiveLang();

  private _isInitialLangEffectRun = true;

  constructor() {
    effect(() => {
      this._activeLang();

      if (this._isInitialLangEffectRun) {
        this._isInitialLangEffectRun = false;
        return;
      }

      this.challengesService.getCategories();
    });

    effect((onCleanup) => {
      onCleanup(() => {
        this.challengesService.resetCategories();
      });
    });
  }

  ngOnInit(): void {
    this.challengesService.getCategories();
  }
}
