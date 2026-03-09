import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerTileGroupComponent } from './answer-tile-group.component';

describe('AnswerTileGroupComponent', () => {
  let component: AnswerTileGroupComponent;
  let fixture: ComponentFixture<AnswerTileGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerTileGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerTileGroupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'question-1');
    fixture.componentRef.setInput('question', 'What is JavaScript?');
    fixture.componentRef.setInput('answers', [
      { id: 'a', text: 'A programming language' },
      { id: 'b', text: 'A database' },
    ]);
    // Important: required input must be set (value may be undefined).
    fixture.componentRef.setInput('answerResult', undefined);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
