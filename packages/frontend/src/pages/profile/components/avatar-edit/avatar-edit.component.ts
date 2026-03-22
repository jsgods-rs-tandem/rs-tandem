import { Component, computed, effect, input, output, signal } from '@angular/core';
import { AVATAR_POOL, DEFAULT_AVATAR_URL } from '@/core/constants';
import { ButtonComponent } from '@/shared/ui';

@Component({
  selector: 'app-avatar-edit',
  imports: [ButtonComponent],
  templateUrl: './avatar-edit.component.html',
  styleUrl: './avatar-edit.component.scss',
})
export class AvatarEditComponent {
  currentAvatar = input<string | null>(null);
  avatarSelected = output<string>();
  readonly selectedAvatarUrl = signal<string>(DEFAULT_AVATAR_URL);

  readonly avatars = AVATAR_POOL;
  readonly startIndex = signal(0);
  readonly itemsToShow = 3;

  readonly visibleAvatars = computed(() => {
    return this.avatars.slice(this.startIndex(), this.startIndex() + this.itemsToShow);
  });

  readonly canGoPrev = computed(() => this.startIndex() > 0);
  readonly canGoNext = computed(() => this.startIndex() + this.itemsToShow < this.avatars.length);

  constructor() {
    effect(() => {
      const avatar = this.currentAvatar();
      this.selectedAvatarUrl.set(avatar ?? DEFAULT_AVATAR_URL);
    });
  }

  prev(): void {
    if (this.canGoPrev()) {
      this.startIndex.update((i) => i - 1);
    }
  }

  next(): void {
    if (this.canGoNext()) {
      this.startIndex.update((i) => i + 1);
    }
  }

  selectAvatar(url: string): void {
    this.selectedAvatarUrl.set(url);
    this.avatarSelected.emit(url);
  }
}
