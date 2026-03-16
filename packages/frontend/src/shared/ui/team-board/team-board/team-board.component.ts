import { Component } from '@angular/core';
import { TeamMemberCardComponent } from '../team-member-card/team-member-card.component';
import { TEAM_MEMBERS } from './team-board.config';

@Component({
  selector: 'app-team-board',
  imports: [TeamMemberCardComponent],
  templateUrl: './team-board.component.html',
  styleUrl: './team-board.component.scss',
})
export class TeamBoardComponent {
  protected readonly teamMembers = TEAM_MEMBERS;
}
