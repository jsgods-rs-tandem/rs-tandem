import { Component, input } from '@angular/core';

import { CategoryCardComponent } from '../category-card/category-card.component';

import type { CategoryCardListItem } from './category-card-list.types';

@Component({
  selector: 'app-category-card-list',
  imports: [CategoryCardComponent],
  templateUrl: './category-card-list.component.html',
  styleUrl: './category-card-list.component.scss',
  standalone: true,
})
export class CategoryCardListComponent {
  readonly categories = input.required<CategoryCardListItem[]>();
}
