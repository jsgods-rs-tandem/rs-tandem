import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamBoardComponent } from './team-board.component';

describe('TeamBoardComponent', () => {
  let component: TeamBoardComponent;
  let fixture: ComponentFixture<TeamBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamBoardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
