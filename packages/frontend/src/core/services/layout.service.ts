import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
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
        const layoutConfig = this.getRouteData('layout');

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

  private getRouteData(key: string): unknown {
    let route: ActivatedRouteSnapshot | null = this.router.routerState.root.snapshot;

    while (route.firstChild) {
      route = route.firstChild;
    }

    let currentRoute: ActivatedRouteSnapshot | null = route;
    while (currentRoute) {
      if (currentRoute.data[key]) {
        return currentRoute.data[key];
      }
      currentRoute = currentRoute.parent;
    }

    return null;
  }
}
