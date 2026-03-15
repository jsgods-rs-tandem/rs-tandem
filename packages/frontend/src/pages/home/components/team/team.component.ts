import { Component } from '@angular/core';
import { TeamBoardComponent } from '@/shared/ui';

@Component({
  selector: 'app-team',
  imports: [TeamBoardComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent {
  readonly title = 'Team';
}
