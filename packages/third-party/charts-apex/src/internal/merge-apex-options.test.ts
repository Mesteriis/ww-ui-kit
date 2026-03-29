import { describe, expect, it } from 'vitest';
import type { ApexOptions } from 'apexcharts';

import { mergeApexOptions } from './merge-apex-options';

describe('mergeApexOptions', () => {
  it('deep merges objects, replaces arrays, and does not mutate inputs', () => {
    const base: ApexOptions = {
      chart: {
        id: 'base',
        toolbar: {
          tools: {
            download: true,
            zoom: true
          }
        }
      },
      colors: ['#111111', '#222222'],
      xaxis: {
        categories: ['Jan', 'Feb']
      }
    };

    const overrides: ApexOptions = {
      chart: {
        toolbar: {
          show: true
        }
      },
      colors: ['#333333'],
      xaxis: {
        labels: {
          rotate: 0
        }
      }
    };

    const baseSnapshot = structuredClone(base);
    const overrideSnapshot = structuredClone(overrides);
    const merged = mergeApexOptions(base, overrides);

    expect(merged).toEqual({
      chart: {
        id: 'base',
        toolbar: {
          show: true,
          tools: {
            download: true,
            zoom: true
          }
        }
      },
      colors: ['#333333'],
      xaxis: {
        categories: ['Jan', 'Feb'],
        labels: {
          rotate: 0
        }
      }
    });
    expect(base).toEqual(baseSnapshot);
    expect(overrides).toEqual(overrideSnapshot);
  });

  it('clones plain values, ignores undefined sources, and replaces non-object targets', () => {
    const merged = mergeApexOptions(
      {
        tooltip: {
          enabled: true
        },
        chart: null
      } as unknown as ApexOptions,
      undefined,
      {
        chart: {
          id: 'chart-id'
        },
        colors: ['#123456']
      }
    );

    expect(merged).toEqual({
      chart: {
        id: 'chart-id'
      },
      colors: ['#123456'],
      tooltip: {
        enabled: true
      }
    });
  });

  it('replaces non-plain objects instead of attempting to deep merge them', () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const merged = mergeApexOptions(
      {
        chart: {
          id: 'existing'
        },
        custom: createdAt
      } as unknown as ApexOptions,
      {
        chart: {
          id: 'next'
        }
      }
    ) as ApexOptions & { custom?: Date };

    expect(merged.chart?.id).toBe('next');
    expect(merged.custom).toBe(createdAt);
  });

  it('preserves existing nested values when an override explicitly contains undefined fields', () => {
    const merged = mergeApexOptions(
      {
        chart: {
          toolbar: {
            show: true
          }
        }
      },
      {
        chart: {
          toolbar: undefined
        }
      }
    );

    expect(merged.chart?.toolbar).toEqual({
      show: true
    });
  });
});
