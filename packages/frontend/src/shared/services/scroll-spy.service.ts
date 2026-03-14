import { DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WINDOW } from '@/shared/tokens/window.token';

@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  private platformId = inject(PLATFORM_ID);
  private window = inject(WINDOW);
  private destroyRef = inject(DestroyRef);

  private observer: IntersectionObserver | null = null;

  activeAnchor = signal<string>('');
  private isAnchorLocked = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });
  }

  spy(elements: HTMLElement[]): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.cleanup();

    this.observer = new this.window.IntersectionObserver(
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
      this.observer?.observe(element);
    });
  }

  setAnchorManually(id: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isAnchorLocked = true;
    this.activeAnchor.set(id);

    const onScrollEnd = () => {
      this.isAnchorLocked = false;
      this.window.removeEventListener('scrollend', onScrollEnd);
    };

    this.window.addEventListener('scrollend', onScrollEnd);

    setTimeout(() => {
      this.isAnchorLocked = false;
    }, 1000);
  }
  public cleanup(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
