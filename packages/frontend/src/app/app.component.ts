import { HeaderComponent } from '@/core/components/header/header.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'JSGods';
}
