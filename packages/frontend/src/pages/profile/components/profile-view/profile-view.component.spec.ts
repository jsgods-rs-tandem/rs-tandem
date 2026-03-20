import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewComponent } from './profile-view.component';

const mockUser = {
  id: '1',
  displayName: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'https://avatar.com/1.png',
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
    fixture.componentRef.setInput('user', {
      displayName: 'Guest',
      email: 'guest@example.com',
      createdAt: new Date().toISOString(),
    });

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
