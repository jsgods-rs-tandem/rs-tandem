import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import { provideRouter } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';
import { ROUTE_PATHS } from '@/core/constants';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@/shared/ui';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  const authServiceMock = {
    isAuthenticated: vi.fn(),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the 404 title and fixed text', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    fixture.detectChanges();

    const h1: unknown = fixture.debugElement.query(By.css('h1')).nativeElement;
    const p: unknown = fixture.debugElement.query(By.css('.not-found__text')).nativeElement;

    if (h1 instanceof HTMLElement && p instanceof HTMLElement) {
      expect(h1.textContent).toBe('404');
      expect(p.textContent).toContain("We couldn't find that page");
    } else {
      throw new Error('Elements not found or not HTMLElements');
    }
  });

  it('should show "Go Home" when user is NOT authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    fixture.detectChanges();

    expect(component.buttonText()).toBe('Go Home');
    expect(component.buttonPath()).toBe(ROUTE_PATHS.home);

    const button = fixture.debugElement.query(By.css('app-button'));

    if (button.componentInstance instanceof ButtonComponent) {
      const instance = button.componentInstance;

      expect(instance.text()).toBe('Go Home');
      expect(instance.link()).toBe(ROUTE_PATHS.home);
    } else {
      throw new Error('ButtonComponent not found or has wrong type');
    }
  });

  it('should show "Back to Library" when user IS authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    fixture.detectChanges();

    expect(component.buttonText()).toBe('Back to Library');
    expect(component.buttonPath()).toBe(ROUTE_PATHS.library);

    const button = fixture.debugElement.query(By.css('app-button'));

    if (button.componentInstance instanceof ButtonComponent) {
      const instance = button.componentInstance;

      expect(instance.text()).toBe('Back to Library');
      expect(instance.link()).toBe(ROUTE_PATHS.library);
    } else {
      throw new Error('ButtonComponent not found or has wrong type');
    }
  });
});
