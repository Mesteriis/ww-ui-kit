function cloneUnknown<TValue>(value: TValue): TValue {
  if (Array.isArray(value)) {
    return value.map((entry) => cloneUnknown(entry)) as TValue;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as TValue;
  }

  if (value instanceof File || value instanceof Blob) {
    return value;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, cloneUnknown(entry)])
    ) as TValue;
  }

  return value;
}

export function cloneRecord<TValue extends Record<string, unknown>>(value: TValue | undefined) {
  if (!value) {
    return {} as TValue;
  }

  return cloneUnknown(value);
}

function normalizeSegments(path: string) {
  return path
    .split('.')
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function getValueAtPath(
  source: Record<string, unknown> | undefined,
  path: string
): unknown {
  const segments = normalizeSegments(path);
  let current: unknown = source;

  for (const segment of segments) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

export function setValueAtPath<TValue extends Record<string, unknown>>(
  source: TValue | undefined,
  path: string,
  nextValue: unknown
) {
  const result = cloneRecord(source);
  const segments = normalizeSegments(path);

  if (segments.length === 0) {
    return result;
  }

  let current: Record<string, unknown> = result;

  for (const segment of segments.slice(0, -1)) {
    const next = current[segment];
    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      current[segment] = {};
    }

    current = current[segment] as Record<string, unknown>;
  }

  current[segments.at(-1) ?? path] = nextValue;
  return result;
}

export function deleteValueAtPath<TValue extends Record<string, unknown>>(
  source: TValue | undefined,
  path: string
) {
  const result = cloneRecord(source);
  const segments = normalizeSegments(path);

  if (segments.length === 0) {
    return result;
  }

  let current: Record<string, unknown> = result;

  for (const segment of segments.slice(0, -1)) {
    const next = current[segment];
    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      return result;
    }

    current = next as Record<string, unknown>;
  }

  delete current[segments.at(-1) ?? path];
  return result;
}
