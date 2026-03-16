import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BreadcrumbComponent } from './breadcrumb.component';

import { BreadcrumbService } from '@/shared/services';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async () => {
    const breadcrumbServiceStub: Pick<BreadcrumbService, 'breadcrumbs'> = {
      breadcrumbs: signal([{ label: 'Only', url: '/only' }]),
    };

    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        provideRouter([]),
        { provide: BreadcrumbService, useValue: breadcrumbServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide breadcrumb nav when only one crumb', () => {
    fixture.detectChanges();

    const nav = document.querySelector('[data-testid="breadcrumb-nav"]');
    if (!(nav instanceof HTMLElement)) {
      throw new Error('Breadcrumb nav element not found');
    }

    expect(nav.classList.contains('breadcrumb_hidden')).toBe(true);
  });
});
