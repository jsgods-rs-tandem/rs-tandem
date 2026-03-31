import { Component, computed, inject } from '@angular/core';
import { ButtonComponent } from '@/shared/ui';
import { ROUTE_PATHS } from '@/core/constants';
import { AuthService } from '@/core/services/auth.service';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
  selector: 'app-not-found',
  imports: [ButtonComponent, TypedTranslocoPipe],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  private authService = inject(AuthService);

  readonly buttonTextKey = computed(() =>
    this.authService.isAuthenticated()
      ? marker('notFound.buttons.backToLibrary')
      : marker('notFound.buttons.goHome'),
  );

  readonly buttonPath = computed(() =>
    this.authService.isAuthenticated() ? ROUTE_PATHS.library : ROUTE_PATHS.home,
  );
}
