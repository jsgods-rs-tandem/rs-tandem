import { Component, inject, type OnInit } from '@angular/core';

import { LayoutComponent } from '@/pages/layout';
import { ProgressComponent } from '@/shared/ui';
import { ChallengePreviewCardComponent } from '../../ui';

import { ChallengesService } from '../../services';

@Component({
  selector: 'app-category-page',
  imports: [ChallengePreviewCardComponent, LayoutComponent, ProgressComponent],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  standalone: true,
})
export class CategoryPageComponent implements OnInit {
  readonly challengesService = inject(ChallengesService);

  ngOnInit(): void {
    this.challengesService.getCategory();
  }
}
