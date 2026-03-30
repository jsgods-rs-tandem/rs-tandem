import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  OnDestroy,
  output,
  input,
  inject,
  effect,
  PLATFORM_ID,
} from '@angular/core';

@Directive({
  selector: '[appInView]',
  standalone: true,
})
export class InViewDirective implements OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly window = inject(DOCUMENT).defaultView;
  /**
   * Percentage of the element's visibility (0.0 to 1.0) required to trigger the observer
   */
  threshold = input<number>(0.2);
  /**
   * Event emitted once the element enters the viewport according to the defined threshold
   */
  appeared = output();

  private observer: IntersectionObserver | null = null;

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId) || !this.window?.IntersectionObserver) {
        return;
      }
      const currentThreshold = this.threshold();

      this.cleanup();

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.element.nativeElement.classList.add('is-in-view');
              this.appeared.emit();
              this.observer?.disconnect();
            }
          });
        },
        { threshold: currentThreshold },
      );

      this.observer.observe(this.element.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
