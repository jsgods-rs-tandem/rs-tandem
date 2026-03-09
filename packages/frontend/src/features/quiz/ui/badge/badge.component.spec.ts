import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeComponent } from './badge.component';

import { computeRewardLevel } from '../../utilities';
import { REWARD_LEVEL, REWARD_SCORE } from '../../constants';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('score', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('computeRewardLevel', () => {
  it.each([
    { score: REWARD_SCORE[REWARD_LEVEL.senior], expected: REWARD_LEVEL.senior },
    { score: REWARD_SCORE[REWARD_LEVEL.senior] - 1, expected: REWARD_LEVEL.middle },

    { score: REWARD_SCORE[REWARD_LEVEL.middle], expected: REWARD_LEVEL.middle },
    { score: REWARD_SCORE[REWARD_LEVEL.middle] - 1, expected: REWARD_LEVEL.junior },

    { score: REWARD_SCORE[REWARD_LEVEL.junior], expected: REWARD_LEVEL.junior },
    { score: REWARD_SCORE[REWARD_LEVEL.junior] - 1, expected: REWARD_LEVEL.trainee },

    { score: 0, expected: REWARD_LEVEL.trainee },
  ])('score=$score -> $expected', ({ score, expected }) => {
    expect(computeRewardLevel(score)).toBe(expected);
  });
});
