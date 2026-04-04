import { clampNumber, resolveNumberPrecision, roundNumber, stepNumberish } from '../shared/number';

export type UiSliderOrientation = 'horizontal' | 'vertical';

export type UiSliderMark = {
  value: number;
  label?: string;
};

type SliderNumberOptions = {
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  precision?: number | undefined;
};

type RangeOptions = SliderNumberOptions & {
  minRange?: number | undefined;
};

export function resolveSliderBounds(min?: number, max?: number) {
  const resolvedMin = Number.isFinite(min) ? (min as number) : 0;
  const rawMax = Number.isFinite(max) ? (max as number) : 100;

  return {
    min: resolvedMin,
    max: rawMax >= resolvedMin ? rawMax : resolvedMin,
  };
}

export function resolveSliderStep(step?: number) {
  return Number.isFinite(step) && Math.abs(step as number) > Number.EPSILON
    ? Math.abs(step as number)
    : 1;
}

export function resolveSliderPrecision(options: SliderNumberOptions) {
  return resolveNumberPrecision(resolveSliderStep(options.step), options.precision);
}

export function snapSliderValue(value: number, options: SliderNumberOptions) {
  const bounds = resolveSliderBounds(options.min, options.max);
  const step = resolveSliderStep(options.step);
  const precision = resolveSliderPrecision(options);
  const clampedValue = clampNumber(value, bounds.min, bounds.max);
  const stepIndex = Math.round((clampedValue - bounds.min) / step);

  return clampNumber(roundNumber(bounds.min + stepIndex * step, precision), bounds.min, bounds.max);
}

export function resolveSliderValue(value: number | null | undefined, options: SliderNumberOptions) {
  const bounds = resolveSliderBounds(options.min, options.max);
  return snapSliderValue(value ?? bounds.min, options);
}

export function resolveSliderRatio(value: number, min: number, max: number) {
  if (max <= min) {
    return 0;
  }

  return (value - min) / (max - min);
}

export function resolveSliderMarks(
  marks: readonly UiSliderMark[] | undefined,
  options: SliderNumberOptions
) {
  if (!marks?.length) {
    return [];
  }

  const bounds = resolveSliderBounds(options.min, options.max);
  const seen = new Set<number>();

  return marks
    .filter((mark) => Number.isFinite(mark.value))
    .map((mark) => {
      const value = snapSliderValue(mark.value, options);
      return {
        value,
        label: mark.label,
        ratio: resolveSliderRatio(value, bounds.min, bounds.max),
      };
    })
    .filter((mark) => {
      if (mark.value < bounds.min || mark.value > bounds.max || seen.has(mark.value)) {
        return false;
      }

      seen.add(mark.value);
      return true;
    })
    .sort((left, right) => left.value - right.value);
}

export function stepSliderValue(
  currentValue: number | null | undefined,
  direction: 1 | -1,
  options: SliderNumberOptions & {
    page?: boolean | undefined;
    minOverride?: number | undefined;
    maxOverride?: number | undefined;
  }
) {
  const bounds = resolveSliderBounds(
    options.minOverride ?? options.min,
    options.maxOverride ?? options.max
  );
  const step = resolveSliderStep(options.step);
  const precision = resolveSliderPrecision(options);

  return stepNumberish({
    currentValue: currentValue ?? null,
    direction,
    step,
    precision,
    min: bounds.min,
    max: bounds.max,
    page: options.page,
  });
}

export function resolveRangeGap(options: RangeOptions) {
  const bounds = resolveSliderBounds(options.min, options.max);
  const step = resolveSliderStep(options.step);
  const precision = resolveSliderPrecision(options);
  const totalSpan = bounds.max - bounds.min;
  const rawGap =
    Number.isFinite(options.minRange) && (options.minRange as number) > 0
      ? (options.minRange as number)
      : 0;
  const normalizedGap = rawGap > 0 ? Math.ceil(rawGap / step) * step : 0;

  return clampNumber(roundNumber(normalizedGap, precision), 0, totalSpan);
}

export function normalizeRangeValue(
  value: [number, number] | null | undefined,
  options: RangeOptions
) {
  const bounds = resolveSliderBounds(options.min, options.max);
  const gap = resolveRangeGap(options);
  const precision = resolveSliderPrecision(options);

  let start = resolveSliderValue(value?.[0], options);
  let end = resolveSliderValue(value?.[1] ?? bounds.max, options);

  if (start > end) {
    [start, end] = [end, start];
  }

  if (end - start < gap) {
    const expandedEnd = clampNumber(roundNumber(start + gap, precision), bounds.min, bounds.max);
    if (expandedEnd <= bounds.max) {
      end = expandedEnd;
    } else {
      end = bounds.max;
      start = clampNumber(roundNumber(end - gap, precision), bounds.min, bounds.max);
    }
  }

  start = clampNumber(start, bounds.min, end - gap);
  end = clampNumber(end, start + gap, bounds.max);

  return [start, end] as const;
}

export function updateRangeThumb(
  currentValue: readonly [number, number],
  thumb: 'start' | 'end',
  nextValue: number,
  options: RangeOptions
) {
  const bounds = resolveSliderBounds(options.min, options.max);
  const gap = resolveRangeGap(options);
  const precision = resolveSliderPrecision(options);
  const snappedValue = snapSliderValue(nextValue, options);

  if (thumb === 'start') {
    const maxValue = clampNumber(
      roundNumber(currentValue[1] - gap, precision),
      bounds.min,
      bounds.max
    );
    return [clampNumber(snappedValue, bounds.min, maxValue), currentValue[1]] as const;
  }

  const minValue = clampNumber(
    roundNumber(currentValue[0] + gap, precision),
    bounds.min,
    bounds.max
  );
  return [currentValue[0], clampNumber(snappedValue, minValue, bounds.max)] as const;
}

export function ratioToSliderValue(ratio: number, options: SliderNumberOptions) {
  const bounds = resolveSliderBounds(options.min, options.max);
  const clampedRatio = clampNumber(ratio, 0, 1);
  return snapSliderValue(bounds.min + clampedRatio * (bounds.max - bounds.min), options);
}
