import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberCardComponent } from './team-member-card.component';
import { By } from '@angular/platform-browser';

describe('TeamMemberCardComponent', () => {
  let component: TeamMemberCardComponent;
  let fixture: ComponentFixture<TeamMemberCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamMemberCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamMemberCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'Initial Name');
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
    fixture.componentRef.setInput('name', 'Diana Dukhovskaya');
    fixture.componentRef.setInput('avatarUrl', 'test-url');
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css('.team-card__name'))
      .nativeElement as HTMLElement;
    expect(nameElement.textContent.trim()).toBe('Diana Dukhovskaya');
  });

  it('should compute displayHref for GitHub login correctly', () => {
    fixture.componentRef.setInput('name', 'Diana Dukhovskaya');
    fixture.componentRef.setInput('avatarUrl', 'test-url');
    fixture.componentRef.setInput('githubLogin', 'dukhd');

    expect(component.displayHref()).toBe('https://github.com/dukhd');
  });

  it('should prioritize externalLink over githubLogin', () => {
    fixture.componentRef.setInput('name', 'RS School');
    fixture.componentRef.setInput('avatarUrl', 'test-url');
    fixture.componentRef.setInput('githubLogin', 'test-login');
    fixture.componentRef.setInput('externalLink', 'https://rs.school/');
    fixture.componentRef.setInput('linkText', 'RS school');

    expect(component.displayHref()).toBe('https://rs.school/');
  });

  it('should apply "team-card_rotate" class when isRotate is true', () => {
    fixture.componentRef.setInput('name', 'RS School');
    fixture.componentRef.setInput('avatarUrl', 'test-url');
    fixture.componentRef.setInput('isRotate', true);
    fixture.detectChanges();

    const articleElement = fixture.debugElement.query(By.css('article'))
      .nativeElement as HTMLElement;
    expect(articleElement.classList).toContain('team-card_rotate');
  });
});
