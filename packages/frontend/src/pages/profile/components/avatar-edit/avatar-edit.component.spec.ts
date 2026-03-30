import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarEditComponent } from './avatar-edit.component';
import { AVATAR_POOL, DEFAULT_AVATAR_URL } from '@/core/constants';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('AvatarEditComponent', () => {
  let component: AvatarEditComponent;
  let fixture: ComponentFixture<AvatarEditComponent>;
  let element: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarEditComponent],
      providers: [provideAppTranslocoTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show default avatar', () => {
    const image = element.querySelector<HTMLImageElement>('.avatar-edit__main img');
    expect(image?.src).toContain(DEFAULT_AVATAR_URL);
  });

  it('should change index and offset when "next" is clicked', () => {
    expect(component.startIndex()).toBe(0);
    const nextButton = element.querySelector<HTMLButtonElement>('.button_next');
    nextButton?.click();
    fixture.detectChanges();
    expect(component.startIndex()).toBe(1);
    expect(component.transformOffset()).toBe(-76);
  });

  it('should change index and offset when "prev" is clicked', () => {
    component.startIndex.set(3);
    fixture.detectChanges();
    expect(component.startIndex()).toBe(3);
    const previousButton = element.querySelector<HTMLButtonElement>('.button_prev');
    previousButton?.click();
    expect(component.startIndex()).toBe(2);
    expect(component.transformOffset()).toBe(-152);
  });

  it('should change "prev" to disabled true when startIndex = 0', () => {
    component.startIndex.set(1);
    fixture.detectChanges();
    expect(component.startIndex()).toBe(1);
    const buttonHost = element.querySelector<HTMLButtonElement>('.button_prev');
    const nativeButton = buttonHost?.querySelector('button');
    buttonHost?.click();
    fixture.detectChanges();
    expect(component.startIndex()).toBe(0);
    expect(nativeButton?.disabled).toBe(true);
  });

  it('should emit selected avatar and update main image', () => {
    const emitSpy = vi.spyOn(component.avatarSelected, 'emit');
    const testAvatar = AVATAR_POOL[1];

    component.selectAvatar(testAvatar);
    fixture.detectChanges();
    expect(component.selectedAvatarUrl()).toBe(testAvatar);
    expect(emitSpy).toHaveBeenCalledWith(testAvatar);
    const selectedImage = element.querySelector<HTMLImageElement>('.avatar-edit__large');
    expect(selectedImage?.src).toContain(testAvatar);
  });

  it('should select avatar when carousel item is clicked in HTML', () => {
    const emitSpy = vi.spyOn(component.avatarSelected, 'emit');
    const allAvatarButtons = element.querySelectorAll<HTMLElement>('.carousel-items__button');
    allAvatarButtons[1]?.click();
    fixture.detectChanges();
    const expectedAvatar = AVATAR_POOL[1];
    expect(component.selectedAvatarUrl()).toBe(expectedAvatar);
    expect(emitSpy).toHaveBeenCalledWith(expectedAvatar);
  });
});
