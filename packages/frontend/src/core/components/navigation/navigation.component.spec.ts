import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';
import { provideRouter } from '@angular/router';
import { ScrollSpyService } from '@/shared/services/scroll-spy.service';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        provideRouter([]),
        {
          provide: ScrollSpyService,
          useValue: { activeAnchor: () => '' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('links', []);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render links when provided', () => {
    fixture.componentRef.setInput('links', [
      { label: 'Test Link1', path: 'test1', isAnchor: true },
    ]);
    fixture.detectChanges();
    const element: unknown = fixture.nativeElement;
    if (element instanceof HTMLElement) {
      expect(element.textContent).toContain('Test Link1');
    } else {
      throw new Error('Expected nativeElement to be an HTMLElement');
    }
  });
});
