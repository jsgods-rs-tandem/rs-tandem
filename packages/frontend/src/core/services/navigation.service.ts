import { computed, Injectable, signal } from '@angular/core';
import { NavLink } from '../components/navigation/navigation.types';
import { ROUTE_PATHS } from '@/core/constants';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Injectable({ providedIn: 'root' })
export class NavService {
  private readonly guestLinks: NavLink[] = [
    { label: marker('nav.guest.about'), path: 'about', isAnchor: true },
    { label: marker('nav.guest.modules'), path: 'modules', isAnchor: true },
    { label: marker('nav.guest.faq'), path: 'faq', isAnchor: true },
    { label: marker('nav.guest.team'), path: 'team', isAnchor: true },
  ];

  private readonly authLinks: NavLink[] = [
    { label: marker('nav.auth.profile'), path: ROUTE_PATHS.profile, isAnchor: false },
    { label: marker('nav.auth.library'), path: ROUTE_PATHS.library, isAnchor: false },
    { label: marker('nav.auth.settings'), path: ROUTE_PATHS.settings, isAnchor: false },
  ];

  private isAuthenticated = signal<boolean>(false);

  links = computed(() => (this.isAuthenticated() ? this.authLinks : this.guestLinks));

  setAuthState(isAuth: boolean): void {
    this.isAuthenticated.set(isAuth);
  }
}
