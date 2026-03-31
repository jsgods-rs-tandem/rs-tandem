import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamMemberCardComponent } from './team-member-card.component';
import { By } from '@angular/platform-browser';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';
import { marker } from '@jsverse/transloco-keys-manager/marker';

describe('TeamMemberCardComponent', () => {
  let component: TeamMemberCardComponent;
  let fixture: ComponentFixture<TeamMemberCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamMemberCardComponent],
      providers: [provideAppTranslocoTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamMemberCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('nameKey', marker('team.members.diana'));
    fixture.componentRef.setInput(
      'avatarUrl',
      'https://avatars.githubusercontent.com/u/127693483?v=4',
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct name', () => {
    const testKey = marker('team.members.diana');
    fixture.componentRef.setInput('nameKey', testKey);
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css('.team-card__name'))
      .nativeElement as HTMLElement;
    expect(nameElement.textContent.trim()).toBe(testKey);
  });

  it('should apply "team-card_rotate" class when isRotate is true', () => {
    fixture.componentRef.setInput('nameKey', marker('team.members.rss'));
    fixture.componentRef.setInput('isRotate', true);
    fixture.detectChanges();

    const articleElement = fixture.debugElement.query(By.css('article'))
      .nativeElement as HTMLElement;
    expect(articleElement.classList).toContain('team-card_rotate');
  });
});
