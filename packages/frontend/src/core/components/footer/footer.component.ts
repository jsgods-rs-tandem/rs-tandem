import { EXTERNAL_LINKS } from '@/core/constants/external-links';
import { ButtonComponent } from '@/shared/ui';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [ButtonComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly githubUrl = EXTERNAL_LINKS.githubRepo;
  readonly buttonAriaLabel = 'Project Repository';
}
