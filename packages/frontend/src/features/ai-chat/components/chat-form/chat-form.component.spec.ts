import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFormComponent } from './chat-form.component';

describe('ChatForm', () => {
  let component: ChatFormComponent;
  let fixture: ComponentFixture<ChatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit send event with input value and clear textarea', () => {
    vi.spyOn(component.sendMessageEvent, 'emit');
    if (fixture.nativeElement instanceof HTMLElement) {
      const textarea = fixture.nativeElement.querySelector('textarea');
      if (textarea) {
        textarea.value = 'Hello, AI!';
        textarea.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const formElement = fixture.nativeElement.querySelector('form');
        formElement?.dispatchEvent(new Event('submit'));
        fixture.detectChanges();

        expect(component.sendMessageEvent.emit).toHaveBeenCalledWith('Hello, AI!');
        expect(textarea.value).toBe('');
      }
    }
  });
});
