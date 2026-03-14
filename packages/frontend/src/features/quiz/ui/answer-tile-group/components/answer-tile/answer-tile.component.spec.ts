import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerTileComponent } from './answer-tile.component';

describe('AnswerTileComponent', () => {
  let component: AnswerTileComponent;
  let fixture: ComponentFixture<AnswerTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerTileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerTileComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'question-1');
    fixture.componentRef.setInput('value', 'answer-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
