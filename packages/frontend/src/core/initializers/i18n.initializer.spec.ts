import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';
import { initializeI18n } from './i18n.initializer';

describe('initializeI18n', () => {
  let document: Document;
  let translocoService: TranslocoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideAppTranslocoTesting()],
    });

    document = TestBed.inject(DOCUMENT);
    translocoService = TestBed.inject(TranslocoService);

    TestBed.runInInjectionContext(() => {
      initializeI18n();
    });
  });

  it('should set html lang attribute to the default language', () => {
    expect(document.documentElement.lang).toBe('en');
  });

  it('should update html lang attribute when language changes', () => {
    translocoService.setActiveLang('ru');
    expect(document.documentElement.lang).toBe('ru');
  });
});
