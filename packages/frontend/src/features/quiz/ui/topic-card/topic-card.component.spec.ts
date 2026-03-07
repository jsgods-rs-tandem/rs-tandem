import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicCardComponent } from './topic-card.component';

describe('TopicCardComponent', () => {
  let component: TopicCardComponent;
  let fixture: ComponentFixture<TopicCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('heading', 'Introduction');
    fixture.componentRef.setInput(
      'description',
      'Where do you put your scripts? Learn the basics of linking JS to HTML.',
    );
    fixture.componentRef.setInput('questionsCount', 5);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
