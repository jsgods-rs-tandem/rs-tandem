import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NavService } from './navigation.service';
import { HeaderMode } from '../components/header/header.types';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private router = inject(Router);
  private navService = inject(NavService);

  headerMode = signal<HeaderMode>('login');
  showSidebar = signal(true);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        const urlWithoutQuery = event.urlAfterRedirects.split('?')[0] ?? '';
        const url = urlWithoutQuery.split('#')[0] ?? '';
        if (url === '/sign-in' || url === '/sign-up') {
          this.headerMode.set('home');
          this.showSidebar.set(false);
        } else if (url === '/') {
          this.headerMode.set('login');
          this.showSidebar.set(true);
          this.navService.setGuestLinks();
        } else {
          this.headerMode.set('logout');
          this.showSidebar.set(true);
          this.navService.setAuthenticatedLinks();
        }
      });
  }
}
