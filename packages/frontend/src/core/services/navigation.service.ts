import { Injectable, signal } from '@angular/core';
import { NavLink } from '../components/navigation/navigation.types';
import { ROUTE_PATHS } from '@/core/constants';

@Injectable({ providedIn: 'root' })
export class NavService {
  private readonly guestLinks: NavLink[] = [
    { label: 'About', path: 'about', isAnchor: true },
    { label: 'Modules', path: 'modules', isAnchor: true },
    { label: 'FAQ', path: 'faq', isAnchor: true },
    { label: 'Team', path: 'team', isAnchor: true },
  ];

  private readonly authLinks: NavLink[] = [
    { label: 'Profile', path: ROUTE_PATHS.profile, isAnchor: false },
    { label: 'Library', path: ROUTE_PATHS.library, isAnchor: false },
    { label: 'Dashboard', path: ROUTE_PATHS.dashboard, isAnchor: false },
  ];

  links = signal<NavLink[]>(this.guestLinks);

  setAuthenticatedLinks(): void {
    this.links.set(this.authLinks);
  }

  setGuestLinks(): void {
    this.links.set(this.guestLinks);
  }
}
