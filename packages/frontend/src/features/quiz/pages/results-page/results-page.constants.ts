import type { NgxParticlesComponent } from '@tsparticles/angular';

export const particlesOptions: NonNullable<NgxParticlesComponent['options']> = {
  preset: 'confetti',
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    color: {
      value: ['#ff6900', '#ffd54f', '#cfd8dc', '#ffab91', '#f48fb1'],
    },
  },
  emitters: [
    {
      life: {
        duration: 0.24,
        count: 0,
      },
      position: {},
      rate: {
        delay: 0.3,
        quantity: 8,
      },
      particles: {
        move: {
          direction: 'top-right',
        },
      },
    },
    {
      life: {
        duration: 0.24,
        count: 0,
      },
      position: {},
      rate: {
        delay: 0.3,
        quantity: 8,
      },
      particles: {
        move: {
          direction: 'top-left',
        },
      },
    },
  ],
} as const;
