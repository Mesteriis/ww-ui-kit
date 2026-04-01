import type { ISourceOptions } from '@tsparticles/engine';

import type { UiTsParticlesBackdropOptions } from '../types';
import { mergeTsParticlesOptions } from './merge-tsparticles-options';

interface NormalizeTsParticlesOptionsParams {
  userOptions: UiTsParticlesBackdropOptions | undefined;
  particleColor: string;
  linkColor: string;
  reducedMotion: boolean;
}

const baseOptions: ISourceOptions = {
  background: {
    color: {
      value: 'transparent',
    },
  },
  backgroundMask: {
    enable: false,
  },
  detectRetina: true,
  fpsLimit: 60,
  fullScreen: {
    enable: false,
    zIndex: 0,
  },
  interactivity: {
    detectsOn: 'canvas',
    events: {
      onClick: {
        enable: false,
        mode: [],
      },
      onDiv: [],
      onHover: {
        enable: false,
        mode: [],
      },
      resize: {
        enable: true,
      },
    },
  },
  pauseOnBlur: true,
  pauseOnOutsideViewport: true,
  particles: {
    color: {
      value: 'currentColor',
    },
    links: {
      color: 'currentColor',
      distance: 144,
      enable: true,
      opacity: 0.18,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'out',
      },
      random: false,
      speed: 0.4,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        height: 960,
        width: 960,
      },
      value: 28,
    },
    opacity: {
      value: 0.28,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: {
        min: 1,
        max: 3,
      },
    },
  },
};

export function normalizeTsParticlesOptions({
  userOptions,
  particleColor,
  linkColor,
  reducedMotion,
}: NormalizeTsParticlesOptionsParams): ISourceOptions {
  return mergeTsParticlesOptions<ISourceOptions>(baseOptions, userOptions, {
    background: {
      color: {
        value: 'transparent',
      },
    },
    backgroundMask: {
      enable: false,
    },
    fullScreen: {
      enable: false,
      zIndex: 0,
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onClick: {
          enable: false,
          mode: [],
        },
        onDiv: [],
        onHover: {
          enable: false,
          mode: [],
        },
        resize: {
          enable: true,
        },
      },
    },
    particles: {
      color: {
        value: particleColor,
      },
      links: {
        color: linkColor,
      },
      move: {
        enable: !reducedMotion,
      },
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
  });
}
