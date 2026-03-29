import { describe, expect, it, vi } from 'vitest';

import { normalizeApexOptions } from './normalize-apex-options';

describe('normalizeApexOptions', () => {
  it('keeps the prop type canonical and preserves user overrides', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const userOptions = {
      chart: {
        type: 'line' as const,
        id: 'custom-id'
      },
      colors: ['#123456']
    };

    const normalized = normalizeApexOptions({
      chartId: 'generated-id',
      type: 'bar',
      noDataText: 'Nothing here',
      reducedMotion: false,
      themeOptions: {
        tooltip: {
          theme: 'light'
        }
      },
      userOptions
    });

    expect(normalized.chart?.id).toBe('custom-id');
    expect(normalized.chart?.type).toBe('bar');
    expect(normalized.colors).toEqual(['#123456']);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  it('forces reduced-motion chart animations off', () => {
    const normalized = normalizeApexOptions({
      chartId: 'chart-id',
      type: 'line',
      noDataText: 'Nothing here',
      reducedMotion: true,
      themeOptions: {},
      userOptions: {
        chart: {
          animations: {
            enabled: true
          }
        }
      }
    });

    expect(normalized.chart?.animations?.enabled).toBe(false);
    expect(normalized.chart?.animations?.animateGradually?.enabled).toBe(false);
    expect(normalized.chart?.animations?.dynamicAnimation?.enabled).toBe(false);
  });

  it('reuses matching chart types without warning and fills default no-data/chart ids', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const normalized = normalizeApexOptions({
      chartId: 'generated-id',
      type: 'line',
      noDataText: 'Nothing here',
      reducedMotion: false,
      themeOptions: {
        chart: {
          animations: {
            enabled: true
          }
        },
        noData: {
          align: 'center'
        }
      },
      userOptions: {
        chart: {
          type: 'line'
        }
      }
    });

    expect(normalized.chart?.id).toBe('generated-id');
    expect(normalized.chart?.animations?.enabled).toBe(true);
    expect(normalized.noData?.text).toBe('Nothing here');
    expect(normalized.noData?.align).toBe('center');
    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('warns only once per conflicting type pair and tolerates missing console', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    normalizeApexOptions({
      chartId: 'conflict-1',
      type: 'area',
      noDataText: 'Nothing here',
      reducedMotion: false,
      themeOptions: {},
      userOptions: {
        chart: {
          type: 'line'
        }
      }
    });

    normalizeApexOptions({
      chartId: 'conflict-2',
      type: 'area',
      noDataText: 'Nothing here',
      reducedMotion: false,
      themeOptions: {},
      userOptions: {
        chart: {
          type: 'line'
        }
      }
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();

    const originalConsole = globalThis.console;
    Object.defineProperty(globalThis, 'console', {
      configurable: true,
      value: undefined
    });

    const normalized = normalizeApexOptions({
      chartId: 'consoleless',
      type: 'bar',
      noDataText: 'Nothing here',
      reducedMotion: false,
      themeOptions: {},
      userOptions: {
        chart: {
          type: 'line'
        }
      }
    });

    expect(normalized.chart?.type).toBe('bar');

    Object.defineProperty(globalThis, 'console', {
      configurable: true,
      value: originalConsole
    });
  });

  it('keeps canonical defaults when user options are omitted entirely', () => {
    const normalized = normalizeApexOptions({
      chartId: 'no-user-options',
      type: 'donut',
      noDataText: 'No slices',
      reducedMotion: false,
      themeOptions: {}
    });

    expect(normalized.chart?.id).toBe('no-user-options');
    expect(normalized.chart?.type).toBe('donut');
    expect(normalized.chart?.redrawOnParentResize).toBe(true);
    expect(normalized.chart?.animations?.enabled).toBe(true);
    expect(normalized.noData?.text).toBe('No slices');
  });
});
