import { NavService } from '@/core/services/navigation.service';
import { Component, inject } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-sidebar',
  imports: [NavigationComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  navService = inject(NavService);
}
