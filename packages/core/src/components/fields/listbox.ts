import { findTypeaheadMatch } from '../shared/typeahead';

export interface ListboxRecord {
  id: string;
  label: string;
  disabled?: boolean;
  keywords?: readonly string[];
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function includesQuery(record: ListboxRecord, query: string) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return true;
  }

  if (normalizeText(record.label).includes(normalizedQuery)) {
    return true;
  }

  return (record.keywords ?? []).some((keyword) =>
    normalizeText(keyword).includes(normalizedQuery)
  );
}

export function filterListboxRecords<T extends ListboxRecord>(
  records: readonly T[],
  query: string
) {
  return records.filter((record) => includesQuery(record, query));
}

export function findAdjacentListboxRecord<T extends ListboxRecord>(
  records: readonly T[],
  currentId: string | null | undefined,
  direction: 1 | -1
) {
  const enabledRecords = records.filter((record) => !record.disabled);
  if (enabledRecords.length === 0) {
    return null;
  }

  const currentIndex = enabledRecords.findIndex((record) => record.id === currentId);
  if (currentIndex < 0) {
    return direction > 0 ? enabledRecords[0] : enabledRecords[enabledRecords.length - 1];
  }

  const nextIndex = Math.min(enabledRecords.length - 1, Math.max(0, currentIndex + direction));
  return enabledRecords[nextIndex];
}

export function findBoundaryListboxRecord<T extends ListboxRecord>(
  records: readonly T[],
  direction: 'first' | 'last'
) {
  const enabledRecords = records.filter((record) => !record.disabled);
  if (enabledRecords.length === 0) {
    return null;
  }

  return direction === 'first' ? enabledRecords[0] : enabledRecords[enabledRecords.length - 1];
}

export function findListboxTypeaheadRecord<T extends ListboxRecord>(
  records: readonly T[],
  query: string,
  currentId?: string | null
) {
  return (findTypeaheadMatch(records, query, currentId) as T | null) ?? null;
}
