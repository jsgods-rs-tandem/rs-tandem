import { Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import type { Breadcrumb } from './breadcrumb.types';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  readonly breadcrumbs = signal<Breadcrumb[]>([]);

  private _router: Router;
  private _activatedRoute: ActivatedRoute;

  constructor(router: Router, activatedRoute: ActivatedRoute) {
    this._router = router;
    this._activatedRoute = activatedRoute;

    this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.breadcrumbs.set(this.createBreadcrumbs(this._activatedRoute.root));
    });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: Breadcrumb[] = [],
  ): Breadcrumb[] {
    const { children } = route;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL = child.snapshot.url.map((segment) => segment.path).join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const { breadcrumb } = child.snapshot.data;

      if (breadcrumb) {
        const isString = (value: unknown): value is string => typeof value === 'string';
        breadcrumbs.push({ label: isString(breadcrumb) ? breadcrumb : '', url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
