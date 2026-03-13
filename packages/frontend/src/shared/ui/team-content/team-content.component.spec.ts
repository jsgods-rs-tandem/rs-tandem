import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamContentComponent } from './team-content.component';

describe('TeamContentComponent', () => {
  let component: TeamContentComponent;
  let fixture: ComponentFixture<TeamContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamContentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
