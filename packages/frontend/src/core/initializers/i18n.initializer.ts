import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs';

export function initializeI18n() {
  const document = inject(DOCUMENT);
  const meta = inject(Meta);
  const title = inject(Title);
  const translocoService = inject(TranslocoService);

  const syncSeoMeta = (lang: string) => {
    const pageTitle = translocoService.translate('meta.title', {}, lang);
    const description = translocoService.translate('meta.description', {}, lang);
    const ogTitle = translocoService.translate('meta.og.title', {}, lang);
    const ogDescription = translocoService.translate('meta.og.description', {}, lang);
    const ogType = translocoService.translate('meta.og.type', {}, lang);
    const twitterCard = translocoService.translate('meta.twitter.card', {}, lang);
    const twitterTitle = translocoService.translate('meta.twitter.title', {}, lang);
    const twitterDescription = translocoService.translate('meta.twitter.description', {}, lang);

    title.setTitle(pageTitle);
    meta.updateTag({ name: 'description', content: description }, 'name="description"');
    meta.updateTag({ property: 'og:title', content: ogTitle }, 'property="og:title"');
    meta.updateTag(
      { property: 'og:description', content: ogDescription },
      'property="og:description"',
    );
    meta.updateTag({ property: 'og:type', content: ogType }, 'property="og:type"');
    meta.updateTag({ name: 'twitter:card', content: twitterCard }, 'name="twitter:card"');
    meta.updateTag({ name: 'twitter:title', content: twitterTitle }, 'name="twitter:title"');
    meta.updateTag(
      { name: 'twitter:description', content: twitterDescription },
      'name="twitter:description"',
    );
  };

  translocoService.langChanges$
    .pipe(
      startWith(translocoService.getActiveLang()),
      distinctUntilChanged(),
      switchMap((lang) => translocoService.load(lang).pipe(map(() => lang))),
      takeUntilDestroyed(),
    )
    .subscribe((lang) => {
      document.documentElement.lang = lang;
      syncSeoMeta(lang);
    });
}
