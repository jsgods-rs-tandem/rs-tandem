import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileViewComponent } from './profile-view.component';
import { AuthUser } from '@/shared/types';

const mockUser: AuthUser = {
  id: '1',
  displayName: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'https://avatar.com/1.png',
  githubUsername: 'johndoe_dev',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('ProfileViewComponent', () => {
  let component: ProfileViewComponent;
  let fixture: ComponentFixture<ProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
