import type { UiTsParticlesBackdropOptions } from '@ww/tsparticles';

export const playgroundAsideParticles = {
  particles: {
    links: {
      distance: 120,
      opacity: 0.24,
    },
    move: {
      speed: 0.56,
    },
    number: {
      value: 128,
    },
    opacity: {
      value: 0.42,
    },
    size: {
      value: {
        min: 1,
        max: 5,
      },
    },
  },
} satisfies UiTsParticlesBackdropOptions;
