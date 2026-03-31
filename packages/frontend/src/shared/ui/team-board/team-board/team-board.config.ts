import { TeamMember } from '@/shared/types';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    nameKey: marker('team.members.diana'),
    avatarUrl: 'https://avatars.githubusercontent.com/u/127693483?v=4',
    linkText: 'Dukhd',
    linkUrl: 'https://github.com/dukhd',
  },
  {
    nameKey: marker('team.members.boris'),
    avatarUrl: 'https://avatars.githubusercontent.com/u/108838349?v=4',
    linkText: 'elrouss',
    linkUrl: 'https://github.com/elrouss',
  },
  {
    nameKey: marker('team.members.daniil'),
    avatarUrl: 'https://avatars.githubusercontent.com/u/219114816?v=4',
    linkText: 'mikhalenkadaniil',
    linkUrl: 'https://github.com/mikhalenkadaniil',
  },
  {
    nameKey: marker('team.members.mikita'),
    avatarUrl: 'https://avatars.githubusercontent.com/u/56834272?v=4',
    linkText: 'nck1969',
    linkUrl: 'https://github.com/nck1969',
  },
  {
    nameKey: marker('team.members.ales'),
    avatarUrl: 'https://avatars.githubusercontent.com/u/3265335?v=4',
    linkText: 'alesdrobysh',
    linkUrl: 'https://github.com/alesdrobysh',
  },
  {
    nameKey: marker('team.members.rss'),
    avatarUrl: 'assets/images/rss-team.svg',
    linkText: 'RS school',
    linkUrl: 'https://rs.school/',
    isRotate: true,
  },
];
