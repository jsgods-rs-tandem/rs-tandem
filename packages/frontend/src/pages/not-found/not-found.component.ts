import { Component, computed, inject } from '@angular/core';
import { ButtonComponent } from '@/shared/ui';
import { ROUTE_PATHS } from '@/core/constants';
import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-not-found',
  imports: [ButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  private authService = inject(AuthService);

  readonly title = '404';
  readonly text = "We couldn't find that page. Maybe it's playing hide and seek?";
  readonly buttonText = computed(() =>
    this.authService.isAuthenticated() ? 'Back to Library' : 'Go Home',
  );
  readonly buttonPath = computed(() =>
    this.authService.isAuthenticated() ? ROUTE_PATHS.library : ROUTE_PATHS.home,
  );
}
