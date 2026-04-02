import type { UiTsParticlesBackdropOptions } from '@ww/tsparticles';

export const overviewParticlesOptions: UiTsParticlesBackdropOptions = {
  particles: {
    links: {
      opacity: 0.16,
    },
    move: {
      speed: 0.26,
    },
    number: {
      value: 18,
    },
    opacity: {
      value: 0.24,
    },
    size: {
      value: {
        min: 1,
        max: 2,
      },
    },
  },
};

export const calmParticlesOptions: UiTsParticlesBackdropOptions = {
  particles: {
    links: {
      distance: 168,
      opacity: 0.1,
    },
    move: {
      speed: 0.14,
    },
    number: {
      value: 12,
    },
    opacity: {
      value: 0.2,
    },
    size: {
      value: {
        min: 1,
        max: 2,
      },
    },
  },
};

export const denseParticlesOptions: UiTsParticlesBackdropOptions = {
  particles: {
    links: {
      distance: 112,
      opacity: 0.2,
    },
    move: {
      speed: 0.18,
    },
    number: {
      value: 42,
    },
    opacity: {
      value: 0.3,
    },
    size: {
      value: {
        min: 1,
        max: 3,
      },
    },
  },
};
