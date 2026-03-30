import { describe, expect, it } from 'vitest';

import {
  clampNumber,
  formatNumberish,
  normalizeNumberish,
  parseNumberish,
  resolveNumberPrecision,
  roundNumber,
  stepNumberish,
} from './number';

describe('number helpers', () => {
  it('clamps to min and max boundaries', () => {
    expect(clampNumber(-2, 0, 10)).toBe(0);
    expect(clampNumber(12, 0, 10)).toBe(10);
    expect(clampNumber(5, 0, 10)).toBe(5);
  });

  it('rounds and formats values with inferred and explicit precision', () => {
    expect(roundNumber(12.345, 2)).toBe(12.35);
    expect(roundNumber(12.345, undefined)).toBe(12.345);
    expect(formatNumberish(12.3, 2)).toBe('12.30');
    expect(formatNumberish(12.3, undefined)).toBe('12.3');
    expect(formatNumberish(null, 2)).toBe('');
  });

  it('parses, normalizes, and resolves precision from multiple formats', () => {
    expect(normalizeNumberish(' 12,5 ')).toBe('12.5');
    expect(parseNumberish('12.5')).toBe(12.5);
    expect(parseNumberish('.')).toBeNull();
    expect(parseNumberish('nope')).toBeNull();
    expect(parseNumberish('-')).toBeNull();
    expect(resolveNumberPrecision(0.125, undefined)).toBe(3);
    expect(resolveNumberPrecision(Number.NaN, undefined)).toBe(0);
    expect(resolveNumberPrecision(1e-7, undefined)).toBe(7);
    expect(resolveNumberPrecision(1, 4)).toBe(4);
  });

  it('steps values from the current value and from directional fallbacks', () => {
    expect(
      stepNumberish({
        currentValue: 1,
        direction: 1,
        step: 0.5,
        precision: undefined,
        min: 0,
        max: 2,
      })
    ).toBe(1.5);

    expect(
      stepNumberish({
        currentValue: null,
        direction: 1,
        step: 0.5,
        precision: undefined,
        min: 2,
        max: 10,
      })
    ).toBe(2.5);

    expect(
      stepNumberish({
        currentValue: null,
        direction: -1,
        step: 1,
        precision: undefined,
        min: undefined,
        max: 5,
        page: true,
      })
    ).toBe(-5);

    expect(
      stepNumberish({
        currentValue: 9,
        direction: 1,
        step: 2,
        precision: 0,
        min: 0,
        max: 10,
      })
    ).toBe(10);

    expect(
      stepNumberish({
        currentValue: null,
        direction: 1,
        step: 1,
        precision: undefined,
        min: undefined,
        max: undefined,
      })
    ).toBe(1);

    expect(
      stepNumberish({
        currentValue: null,
        direction: -1,
        step: 1,
        precision: undefined,
        min: undefined,
        max: undefined,
      })
    ).toBe(-1);
  });
});
