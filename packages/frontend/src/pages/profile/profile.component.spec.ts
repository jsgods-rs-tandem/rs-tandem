import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AuthStore } from '@/core/store/auth.store';
import { ProfilesService } from '@/core/services/profile.service';
import { AuthService } from '@/core/services/auth.service';
import { ModalService } from '@/core/services/modal.service';
import { By } from '@angular/platform-browser';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let element: HTMLElement;

  const mockUserData = {
    id: '1',
    displayName: 'John Doe',
    email: 'john@example.com',
    avatarUrl: null,
    githubUsername: 'johndoe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockAuthStore = {
    user: signal(mockUserData),
    updateUser: vi.fn(),
  };

  const mockProfilesService = {
    getProfile: vi.fn().mockReturnValue(of(mockUserData)),
    updateProfile: vi.fn().mockReturnValue(of(mockUserData)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        ...provideAppTranslocoTesting(),
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: ProfilesService, useValue: mockProfilesService },
        { provide: AuthService, useValue: { changePassword: vi.fn() } },
        { provide: ModalService, useValue: { open: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.detectChanges();
    const h1 = element.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain('Profile');
  });

  it('should show spinner when loading is true', () => {
    component.facade.loading.set(true);
    fixture.detectChanges();
    const spinner = element.querySelector('app-spin');
    expect(spinner).toBeTruthy();
  });

  it('should switch to edit mode when state is set to edit', () => {
    component.facade.loading.set(false);
    component.facade.state.set('edit');
    fixture.detectChanges();
    const editComponent = element.querySelector('app-profile-edit');
    expect(editComponent).toBeTruthy();
  });

  it('should set state to edit when editClicked emits', () => {
    const viewDebugElement = fixture.debugElement.query(By.css('app-profile-view'));
    viewDebugElement.triggerEventHandler('editClicked', null);
    expect(component.facade.state()).toBe('edit');
  });

  it('should return to view mode when cancelClicked emits from edit component', () => {
    component.facade.state.set('edit');
    fixture.detectChanges();
    const editDebugElement = fixture.debugElement.query(By.css('app-profile-edit'));
    expect(editDebugElement).toBeTruthy();
    editDebugElement.triggerEventHandler('cancelClicked', null);
    expect(component.facade.state()).toBe('view');
    fixture.detectChanges();
    const viewComponent = element.querySelector('app-profile-view');
    expect(viewComponent).toBeTruthy();
  });
});
