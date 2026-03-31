import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { provideRouter } from '@angular/router';
import { ScrollSpyService } from '@/shared/services/scroll-spy.service';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const mockScrollSpyService = {
    spy: () => {
      return;
    },
    cleanup: () => {
      return;
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: ScrollSpyService, useValue: mockScrollSpyService },
        provideAppTranslocoTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
