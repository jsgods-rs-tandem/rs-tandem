import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  activeAnchor = signal<string>('');
  private isAnchorLocked = false;

  spy(elements: HTMLElement[]): void {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (this.isAnchorLocked) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            this.activeAnchor.set(entry.target.id);
          }
        });
      },

      {
        rootMargin: '-80% 0px -80% 0px',
      },
    );
    elements.forEach((element) => {
      observer.observe(element);
    });
  }

  setAnchorManually(id: string) {
    this.isAnchorLocked = true;
    this.activeAnchor.set(id);

    const onScrollEnd = () => {
      this.isAnchorLocked = false;
      window.removeEventListener('scrollend', onScrollEnd);
    };

    window.addEventListener('scrollend', onScrollEnd);

    setTimeout(() => {
      this.isAnchorLocked = false;
    }, 1000);
  }
}
