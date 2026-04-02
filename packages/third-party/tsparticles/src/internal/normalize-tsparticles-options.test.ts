import { describe, expect, it } from 'vitest';

import { normalizeTsParticlesOptions } from './normalize-tsparticles-options';

describe('normalizeTsParticlesOptions', () => {
  it('keeps the wrapper neutral while applying resolved particle colors', () => {
    const options = normalizeTsParticlesOptions({
      particleColor: 'rgb(11, 22, 33)',
      linkColor: 'rgb(44, 55, 66)',
      reducedMotion: false,
      userOptions: {
        background: {
          color: {
            value: 'red',
          },
        },
        fullScreen: {
          enable: true,
        },
        particles: {
          links: {
            distance: 240,
            opacity: 0.3,
          },
          number: {
            value: 12,
          },
        },
      },
    });

    expect(options.background?.color).toEqual({
      value: 'transparent',
    });
    expect(options.fullScreen).toEqual({
      enable: false,
      zIndex: 0,
    });
    expect(options.particles?.color).toEqual({
      value: 'rgb(11, 22, 33)',
    });
    expect(options.particles?.links).toMatchObject({
      color: 'rgb(44, 55, 66)',
      distance: 240,
      opacity: 0.3,
    });
    expect(options.particles?.number).toMatchObject({
      value: 12,
    });
  });

  it('forces motion-sensitive mode off without removing the static backdrop', () => {
    const options = normalizeTsParticlesOptions({
      particleColor: 'rgb(11, 22, 33)',
      linkColor: 'rgb(44, 55, 66)',
      reducedMotion: true,
    });

    expect(options.particles?.move).toMatchObject({
      enable: false,
      speed: 0.4,
    });
    expect(options.particles?.links).toMatchObject({
      enable: true,
      color: 'rgb(44, 55, 66)',
    });
  });
});
