import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { ScrollSpyService } from '@/shared/services/scroll-spy.service';

@Component({
  selector: 'app-home',
  imports: [HeroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private scrollSpy = inject(ScrollSpyService);
  private element = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    const host: unknown = this.element.nativeElement;
    if (host instanceof HTMLElement) {
      const sectionNodes = host.querySelectorAll<HTMLElement>(':scope > [id]');
      const sectionsArray = Array.from(sectionNodes);
      this.scrollSpy.spy(sectionsArray);
    }
  }
}
