import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';
import { initializeI18n } from './i18n.initializer';
import { firstValueFrom } from 'rxjs';
import en from '../../../public/i18n/en.json';
import ru from '../../../public/i18n/ru.json';

describe('initializeI18n', () => {
  let document: Document;
  let meta: Meta;
  let translocoService: TranslocoService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideAppTranslocoTesting()],
    });

    document = TestBed.inject(DOCUMENT);
    meta = TestBed.inject(Meta);
    translocoService = TestBed.inject(TranslocoService);
    translocoService.setTranslation({ meta: en.meta }, 'en');
    translocoService.setTranslation({ meta: ru.meta }, 'ru');

    TestBed.runInInjectionContext(() => {
      initializeI18n();
    });

    await firstValueFrom(translocoService.load('en'));
  });

  it('should set html lang attribute to the default language', () => {
    expect(document.documentElement.lang).toBe('en');
  });

  it('should sync default seo metadata for the current language', () => {
    expect(document.title).toBe('RS Tandem');
    expect(meta.getTag('name="description"')?.content).toContain(
      'The Rolling Scopes Tandem is a platform that helps developers prepare',
    );
    expect(meta.getTag('property="og:title"')?.content).toBe('RS Tandem');
    expect(meta.getTag('name="twitter:card"')?.content).toBe('summary');
    expect(meta.getTag('property="og:image"')).toBeNull();
  });

  it('should update html lang attribute and seo metadata when language changes', async () => {
    translocoService.setActiveLang('ru');

    await firstValueFrom(translocoService.load('ru'));

    expect(document.documentElement.lang).toBe('ru');
    expect(meta.getTag('name="description"')?.content).toContain(
      'The Rolling Scopes Tandem — это платформа',
    );
    expect(meta.getTag('name="twitter:image"')).toBeNull();
  });
});
