import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditComponent } from './profile-edit.component';
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

describe('ProfileEditComponent', () => {
  let component: ProfileEditComponent;
  let fixture: ComponentFixture<ProfileEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileEditComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
