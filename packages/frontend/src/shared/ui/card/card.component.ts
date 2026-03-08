import { Component, computed, contentChild, ElementRef, input } from '@angular/core';

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
  isFooterPositionStart = input<boolean>(true);
  footerExists = contentChild<ElementRef>('footerContent');
  footerClasses = computed(() => {
    return [
      'card__footer',
      this.isFooterPositionStart() ? 'card__footer_start' : 'card__footer_end',
    ].join(' ');
  });
}
