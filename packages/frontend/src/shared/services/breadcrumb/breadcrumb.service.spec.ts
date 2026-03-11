import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BreadcrumbService } from './breadcrumb.service';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
