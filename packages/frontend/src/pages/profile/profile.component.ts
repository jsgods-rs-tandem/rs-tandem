import { Component, computed, inject } from '@angular/core';
import { ProfileViewComponent, ProfileEditComponent } from './components';
import { SpinComponent } from '@/shared/ui';
import { ProfileFacade } from './services/profile.facade';

@Component({
  selector: 'app-profile',
  imports: [ProfileViewComponent, ProfileEditComponent, SpinComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [ProfileFacade],
})
export class ProfileComponent {
  readonly facade = inject(ProfileFacade);

  readonly title = 'Profile';
  readonly isViewing = computed(() => this.facade.state() === 'view');
  readonly isSaving = computed(() => this.facade.state() === 'saving');
}
