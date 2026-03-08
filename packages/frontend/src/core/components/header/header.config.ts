import { IconName } from '@/shared/ui/icon/Icon.types';
import { HeaderMode } from './header.types';

export interface ActionConfig {
  text: string;
  icon: IconName;
  link?: string;
  emitLogout?: boolean;
}

export const HEADER_ACTIONS: Record<HeaderMode, ActionConfig> = {
  login: { text: 'Sign in', icon: 'login', link: '/login' },
  home: { text: 'Home', icon: 'home', link: '/' },
  logout: { text: 'Sign out', icon: 'logout', emitLogout: true },
};
