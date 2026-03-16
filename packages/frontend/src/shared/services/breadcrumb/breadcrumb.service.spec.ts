import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { BreadcrumbService } from './breadcrumb.service';

import { SpinComponent } from '@/shared/ui/spin';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'quiz',
            component: SpinComponent,
            data: { breadcrumb: 'Quiz' },
            children: [
              {
                path: 'topic/:topicId',
                component: SpinComponent,
                data: { breadcrumb: 'Topic' },
              },
            ],
          },
        ]),
      ],
    }).compileComponents();

    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build breadcrumbs on NavigationEnd', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/quiz/topic/123');

    expect(service.breadcrumbs()).toEqual([
      { label: 'Quiz', url: '/quiz' },
      { label: 'Topic', url: '/quiz/topic/123' },
    ]);
  });
});
