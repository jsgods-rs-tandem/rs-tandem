import { Component, effect, inject, input, type OnInit } from '@angular/core';

import { LayoutComponent } from '@/pages/layout';
import { ButtonComponent, EmptyComponent, ProgressComponent } from '@/shared/ui';
import { ChallengePreviewCardComponent } from '../../ui';

import { ChallengesService } from '../../services';

import { injectActiveLang } from '@/shared/utils/translate.utilities';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

@Component({
  selector: 'app-category-page',
  imports: [
    ButtonComponent,
    ChallengePreviewCardComponent,
    EmptyComponent,
    LayoutComponent,
    ProgressComponent,
    TypedTranslocoPipe,
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  standalone: true,
})
export class CategoryPageComponent implements OnInit {
  readonly challengesService = inject(ChallengesService);
  readonly categoryId = input.required<string>();
  private readonly _activeLang = injectActiveLang();

  private _isInitialLangEffectRun = true;

  constructor() {
    effect(
      () => {
        this._activeLang();
        const categoryId = this.categoryId();

        if (this._isInitialLangEffectRun) {
          this._isInitialLangEffectRun = false;
          return;
        }

        this.challengesService.getCategory(categoryId);
      },
      { allowSignalWrites: true },
    );

    effect((onCleanup) => {
      onCleanup(() => {
        this.challengesService.resetCategory();
      });
    });
  }

  ngOnInit(): void {
    if (!this.challengesService.category()) {
      const categoryId = this.categoryId();

      this.challengesService.getCategory(categoryId);
    }
  }
}
