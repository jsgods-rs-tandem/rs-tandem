import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChatComponent } from './ai-chat.component';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('AiChatComponent', () => {
  let component: AiChatComponent;
  let fixture: ComponentFixture<AiChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiChatComponent],
      providers: [provideAppTranslocoTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AiChatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
