import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditComponent } from './profile-edit.component';

const mockUser = {
  id: '1',
  displayName: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'https://avatar.com/1.png',
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
    fixture.componentRef.setInput('user', mockUser);

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
