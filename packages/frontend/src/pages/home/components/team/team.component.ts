import { Component } from '@angular/core';
import { TeamContentComponent } from '@/shared/ui';

@Component({
  selector: 'app-team',
  imports: [TeamContentComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent {
  readonly title = 'Team';
}
