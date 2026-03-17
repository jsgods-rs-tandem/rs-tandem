import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { authGuard } from './auth-guard';
import { AuthService } from '@/core/services/auth.service';
import { vi } from 'vitest';

import { HomeComponent } from '@/pages/home/home.component';
import { LibraryComponent } from '@/pages/library/library.component';
import { SignInComponent } from '@/pages/sign-in/sign-in.component';
import { ScrollSpyService } from '@/shared/services/scroll-spy.service';

import { ROUTES, ROUTE_PATHS } from '@/core/constants';

describe('authGuard', () => {
  beforeEach(async () => {
    const scrollSpyServiceStub: Pick<ScrollSpyService, 'spy' | 'cleanup'> = {
      spy: () => undefined,
      cleanup: () => undefined,
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: ScrollSpyService, useValue: scrollSpyServiceStub },
        provideRouter([
          { path: ROUTES.home, component: HomeComponent, canActivate: [authGuard] },
          { path: ROUTES.library, component: LibraryComponent, canActivate: [authGuard] },
          { path: ROUTES.signIn, component: SignInComponent, canActivate: [authGuard] },
        ]),
      ],
    }).compileComponents();
  });

  it('should redirect authenticated user from sign-in to library', async () => {
    const router = TestBed.inject(Router);
    const harness = await RouterTestingHarness.create();
    const authService = TestBed.inject(AuthService);
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

    await harness.navigateByUrl(ROUTE_PATHS.signIn);

    expect(router.url).toBe(ROUTE_PATHS.library);
  });

  it('should redirect unauthenticated user from library to home', async () => {
    const router = TestBed.inject(Router);
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl(ROUTE_PATHS.library);

    expect(router.url).toBe(ROUTE_PATHS.home);
  });
});
