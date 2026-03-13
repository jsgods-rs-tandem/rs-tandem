import { Component } from '@angular/core';
import { TeamMemberCardComponent } from '../team-member-card/team-member-card.component';
import { TEAM_MEMBERS } from './team-content.config';

@Component({
  selector: 'app-team-content',
  imports: [TeamMemberCardComponent],
  templateUrl: './team-content.component.html',
  styleUrl: './team-content.component.scss',
})
export class TeamContentComponent {
  protected readonly teamMembers = TEAM_MEMBERS;
}
