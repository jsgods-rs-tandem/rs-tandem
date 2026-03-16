import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd, Data } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NavService } from './navigation.service';
import { HeaderMode } from '../components/header/header.types';
import { isLayoutConfig } from '../guards';

export interface LayoutConfig {
  mode: HeaderMode;
  sidebar: boolean;
  auth: boolean;
}

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
      .subscribe(() => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }

        const data: Data = route.snapshot.data;
        const layoutConfig: unknown = data.layout;

        if (isLayoutConfig(layoutConfig)) {
          this.headerMode.set(layoutConfig.mode);
          this.showSidebar.set(layoutConfig.sidebar);
          this.navService.setAuthState(layoutConfig.auth);
        } else {
          this.headerMode.set('home');
          this.showSidebar.set(false);
          this.navService.setAuthState(false);
        }
      });
  }
}
