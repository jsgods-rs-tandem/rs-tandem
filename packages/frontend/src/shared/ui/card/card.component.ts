import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  title = input<string>();
  imageSrc = input<string>();
  imageAlt = input<string>('');
  isFooterPositionStart = input(true);
}
