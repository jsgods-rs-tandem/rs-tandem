import { Component } from '@angular/core';

import { CategoryCardListComponent } from '../../ui/category-card-list/category-card-list.component';

import list from '../../data/categories.json';

@Component({
  selector: 'app-categories-page',
  imports: [CategoryCardListComponent],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
  standalone: true,
})
export class CategoriesPageComponent {
  readonly categories = list.categories;
}
