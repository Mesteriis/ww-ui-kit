function countPrecision(value: number) {
  const normalized = Number.isFinite(value) ? String(value) : '0';
  if (normalized.includes('e-')) {
    const exponent = normalized.slice(normalized.indexOf('e-') + 2);
    return Number.parseInt(exponent, 10);
  }

  const decimal = normalized.split('.')[1];
  return decimal?.length ?? 0;
}

export function clampNumber(value: number, min?: number, max?: number) {
  if (Number.isFinite(min) && value < (min as number)) {
    return min as number;
  }

  if (Number.isFinite(max) && value > (max as number)) {
    return max as number;
  }

  return value;
}

export function resolveNumberPrecision(step: number, precision?: number) {
  if (precision !== undefined) {
    return Math.max(0, precision);
  }

  return countPrecision(step);
}

export function roundNumber(value: number, precision?: number) {
  if (precision === undefined) {
    return value;
  }

  const factor = 10 ** Math.max(0, precision);
  return Math.round(value * factor) / factor;
}

export function normalizeNumberish(value: string) {
  return value.replace(',', '.').trim();
}

export function parseNumberish(value: string) {
  const normalized = normalizeNumberish(value);
  if (!normalized || normalized === '-' || normalized === '.' || normalized === '-.') {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatNumberish(value: number | null, precision?: number) {
  if (value === null) {
    return '';
  }

  if (precision === undefined) {
    return String(value);
  }

  return value.toFixed(Math.max(0, precision));
}

export function stepNumberish(options: {
  currentValue: number | null;
  direction: 1 | -1;
  step: number;
  precision: number | undefined;
  min: number | undefined;
  max: number | undefined;
  page?: boolean | undefined;
}) {
  const stepValue = Math.max(Math.abs(options.step), Number.EPSILON) * (options.page ? 10 : 1);
  const precision = resolveNumberPrecision(stepValue, options.precision);

  const fallbackStart =
    options.currentValue ??
    (options.direction > 0
      ? Number.isFinite(options.min)
        ? (options.min as number)
        : 0
      : Number.isFinite(options.max)
        ? (options.max as number)
        : 0);

  return clampNumber(
    roundNumber(fallbackStart + stepValue * options.direction, precision),
    options.min,
    options.max
  );
}
