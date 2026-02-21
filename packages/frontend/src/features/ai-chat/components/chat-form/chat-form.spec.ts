import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFormComponent } from './chat-form';

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
});
