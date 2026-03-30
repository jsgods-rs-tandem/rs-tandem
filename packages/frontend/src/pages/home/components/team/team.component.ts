import { Component } from '@angular/core';
import { TeamBoardComponent } from '@/shared/ui';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
  selector: 'app-team',
  imports: [TeamBoardComponent, TypedTranslocoPipe],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent {
  readonly titleKey = marker('team.title');
}
