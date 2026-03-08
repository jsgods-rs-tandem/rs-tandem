import { Component } from '@angular/core';
import { ButtonComponent } from '@/shared/ui';

@Component({
  selector: 'app-about',
  imports: [ButtonComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly title = 'About';
  readonly highlightBrand = 'RS-Tandem';
  readonly firstParagraph =
    'is an interactive educational platform designed to gamify technical interview preparation. The platform helps build a clear learning structure and turns routine material review into an engaging process.';
  readonly secondParagraph =
    'We created an environment where you can systematically level up your coding skills and gain confidence for real interviews.';
  readonly buttonText = 'Start your journey';
}
