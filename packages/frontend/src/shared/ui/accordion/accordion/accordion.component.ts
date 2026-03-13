import { Component, contentChildren, effect, input, signal, untracked } from '@angular/core';
import { AccordionItemComponent } from '../accordion-item/accordion-item.component';

@Component({
  selector: 'app-accordion',
  imports: [],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class AccordionComponent {
  multi = input<boolean>(false);
  items = contentChildren(AccordionItemComponent);
  private lastOpenedItem = signal<AccordionItemComponent | null>(null);

  constructor() {
    effect(() => {
      if (this.multi()) return;

      const items = this.items();
      const openItems = items.filter((item) => item.isOpen());

      if (openItems.length === 0) {
        untracked(() => {
          this.lastOpenedItem.set(null);
        });
        return;
      }

      const newlyOpened = openItems.find((item) => item !== this.lastOpenedItem());

      if (newlyOpened) {
        untracked(() => {
          this.lastOpenedItem.set(newlyOpened);
          items.forEach((item) => {
            if (item !== newlyOpened && item.isOpen()) item.isOpen.set(false);
          });
        });
      }
    });
  }
}
