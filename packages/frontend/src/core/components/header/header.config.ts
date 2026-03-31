import { IconName } from '@/shared/ui/icon/Icon.types';
import { HeaderMode } from './header.types';
import { ROUTE_PATHS } from '@/core/constants';
import { AppTranslationKey } from '@/shared/types/translation-keys';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export interface ActionConfig {
  text: AppTranslationKey;
  icon: IconName;
  link?: string;
  isLogoutAction?: boolean;
}

export const HEADER_ACTIONS: Record<HeaderMode, ActionConfig> = {
  login: { text: marker('header.actions.signIn'), icon: 'login', link: ROUTE_PATHS.signIn },
  home: { text: marker('header.actions.home'), icon: 'home', link: ROUTE_PATHS.home },
  logout: { text: marker('header.actions.signOut'), icon: 'logout', isLogoutAction: true },
};
