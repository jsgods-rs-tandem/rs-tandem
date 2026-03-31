import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

const config: TranslocoGlobalConfig = {
  rootTranslationsPath: 'public/i18n/',
  langs: ['en', 'ru'],
  keysManager: {
    input: 'src',
    output: 'public/i18n',
    marker: 't',
    unflat: true,
  },
};

export default config;
