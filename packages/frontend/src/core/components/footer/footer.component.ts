import { EXTERNAL_LINKS } from '@/core/constants/external-links';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';
import { ButtonComponent } from '@/shared/ui';
import { Component } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
  selector: 'app-footer',
  imports: [ButtonComponent, TypedTranslocoPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly githubUrl = EXTERNAL_LINKS.githubRepo;
  readonly githubAriaKey = marker('footer.ariaLabel.github');
}
