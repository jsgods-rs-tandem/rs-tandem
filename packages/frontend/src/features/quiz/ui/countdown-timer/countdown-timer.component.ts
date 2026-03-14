import { Component, computed, effect, input, output, signal } from '@angular/core';

import { DEFAULT_TIME_IN_SECONDS } from './countdown-timer.constants';

import { computeDisplayTime } from './countdown-timer.utilities';

@Component({
  selector: 'app-countdown-timer',
  imports: [],
  templateUrl: './countdown-timer.component.html',
  styleUrl: './countdown-timer.component.scss',
  standalone: true,
})
export class CountdownTimerComponent {
  readonly resetKey = input<unknown>(0);
  readonly durationSec = input<number>(DEFAULT_TIME_IN_SECONDS);
  readonly isRunning = input<boolean>(true);
  readonly expired = output();

  private readonly _timeLeft = signal(this.durationSec());
  private expiredEmitted = false;

  readonly displayTime = computed(() => computeDisplayTime(this._timeLeft()));
  readonly shouldWarn = computed(() => this._timeLeft() < 30);

  constructor() {
    effect(() => {
      this.resetKey();

      const duration = this.durationSec();
      this.expiredEmitted = false;
      this._timeLeft.set(duration);
    });

    effect((onCleanup) => {
      if (!this.isRunning()) {
        return;
      }

      const id = setInterval(() => {
        const next = Math.max(0, this._timeLeft() - 1);

        this._timeLeft.set(next);

        if (next === 0 && !this.expiredEmitted) {
          this.expiredEmitted = true;
          this.expired.emit();
        }
      }, 1000);

      onCleanup(() => {
        clearInterval(id);
      });
    });
  }
}
