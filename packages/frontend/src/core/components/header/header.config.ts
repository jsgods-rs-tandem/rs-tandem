import { IconName } from '@/shared/ui/icon/Icon.types';
import { HeaderMode } from './header.types';
import { ROUTE_PATHS } from '@/core/constants';

export interface ActionConfig {
  text: string;
  icon: IconName;
  link?: string;
  emitLogout?: boolean;
}

export const HEADER_ACTIONS: Record<HeaderMode, ActionConfig> = {
  login: { text: 'Sign in', icon: 'login', link: ROUTE_PATHS.signIn },
  home: { text: 'Home', icon: 'home', link: ROUTE_PATHS.home },
  logout: { text: 'Sign out', icon: 'logout', emitLogout: true },
};
