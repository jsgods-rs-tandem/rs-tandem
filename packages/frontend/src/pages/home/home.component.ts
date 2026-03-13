import { AfterViewInit, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { ScrollSpyService } from '@/shared/services/scroll-spy.service';
import { AboutComponent } from './components/about/about.component';
import { ModulesComponent } from './components/modules/modules.component';
import { FaqComponent } from './components/faq/faq.component';
import { TeamComponent } from './components/team/team.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, AboutComponent, ModulesComponent, FaqComponent, TeamComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private scrollSpy = inject(ScrollSpyService);
  private element = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    const host: unknown = this.element.nativeElement;
    if (host instanceof HTMLElement) {
      const sectionNodes = host.querySelectorAll<HTMLElement>(':scope > [id]');
      const sectionsArray = Array.from(sectionNodes);
      this.scrollSpy.spy(sectionsArray);
      this.destroyRef.onDestroy(() => {
        this.scrollSpy.cleanup();
      });
    }
  }
}
