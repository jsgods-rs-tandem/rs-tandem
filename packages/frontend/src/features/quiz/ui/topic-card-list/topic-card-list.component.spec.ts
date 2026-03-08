import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicCardListComponent } from './topic-card-list.component';

describe('TopicCardListComponent', () => {
  let component: TopicCardListComponent;
  let fixture: ComponentFixture<TopicCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicCardListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicCardListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('topics', [
      {
        id: 'topic-1',
        name: 'Introduction',
        description: 'Where do you put your scripts? Learn the basics of linking JS to HTML.',
        questionsCount: 5,
        score: 100,
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
