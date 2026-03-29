type MergeableValue = Record<string, unknown> | unknown[] | null | undefined;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const prototype = Reflect.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, cloneValue(nestedValue)])
    );
  }

  return value;
}

function mergeValues(target: MergeableValue, source: MergeableValue): MergeableValue {
  if (source === undefined) {
    return cloneValue(target) as MergeableValue;
  }

  if (Array.isArray(source)) {
    return source.map((item) => cloneValue(item));
  }

  if (!isPlainObject(source)) {
    return cloneValue(source) as MergeableValue;
  }

  const base = isPlainObject(target) ? target : {};
  const result: Record<string, unknown> = Object.fromEntries(
    Object.entries(base).map(([key, value]) => [key, cloneValue(value)])
  );

  for (const [key, value] of Object.entries(source)) {
    result[key] = mergeValues(result[key] as MergeableValue, value as MergeableValue);
  }

  return result;
}

export function mergeApexOptions<T extends object>(...sources: Array<T | undefined>): T {
  return sources.reduce<T>((result, source) => {
    if (!source) {
      return result;
    }

    return mergeValues(result as MergeableValue, source as MergeableValue) as T;
  }, {} as T);
}
