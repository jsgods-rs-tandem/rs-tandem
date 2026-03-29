import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { provideRouter } from '@angular/router';
import { ThemeService } from '@/core/services/theme.service';
import { signal } from '@angular/core';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    const themeServiceMock = {
      theme: signal('light'),
      toggleTheme: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideAppTranslocoTesting(),
        provideRouter([]),
        { provide: ThemeService, useValue: themeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
