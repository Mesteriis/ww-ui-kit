import { describe, expect, it } from 'vitest';

import { mergeTsParticlesOptions } from './merge-tsparticles-options';

describe('mergeTsParticlesOptions', () => {
  it('deep merges objects, replaces arrays, and does not mutate inputs', () => {
    const base = {
      particles: {
        color: {
          value: 'rgb(1, 2, 3)',
        },
        move: {
          enable: true,
          speed: 0.5,
        },
      },
      presets: ['calm', 'float'],
    };
    const overrides = {
      particles: {
        move: {
          speed: 0.2,
        },
      },
      presets: ['dense'],
    };

    const baseSnapshot = structuredClone(base);
    const overridesSnapshot = structuredClone(overrides);
    const merged = mergeTsParticlesOptions(base, overrides);

    expect(merged).toEqual({
      particles: {
        color: {
          value: 'rgb(1, 2, 3)',
        },
        move: {
          enable: true,
          speed: 0.2,
        },
      },
      presets: ['dense'],
    });
    expect(base).toEqual(baseSnapshot);
    expect(overrides).toEqual(overridesSnapshot);
  });

  it('replaces non-plain objects and keeps existing nested values when overrides are undefined', () => {
    const createdAt = new Date('2026-04-01T00:00:00.000Z');
    const merged = mergeTsParticlesOptions(
      {
        particles: {
          links: {
            enable: true,
          },
        },
        custom: createdAt,
      },
      {
        particles: {
          links: undefined,
        },
      }
    ) as {
      particles: {
        links?: {
          enable?: boolean;
        };
      };
      custom?: Date;
    };

    expect(merged.particles.links).toEqual({
      enable: true,
    });
    expect(merged.custom).toBe(createdAt);
  });
});
