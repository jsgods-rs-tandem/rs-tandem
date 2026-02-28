import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogueWindowComponent } from './dialogue-window.component';

describe('DialogueWindowComponent', () => {
  let component: DialogueWindowComponent;
  let fixture: ComponentFixture<DialogueWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogueWindowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogueWindowComponent);

    fixture.componentRef.setInput('messages', []);

    component = fixture.componentInstance;

    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
