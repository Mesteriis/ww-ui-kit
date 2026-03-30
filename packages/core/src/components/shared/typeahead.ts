export interface TypeaheadRecord {
  id: string;
  label: string;
  disabled?: boolean;
  keywords?: readonly string[];
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function matchesQuery(record: TypeaheadRecord, query: string) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return false;
  }

  if (normalizeText(record.label).startsWith(normalizedQuery)) {
    return true;
  }

  return (record.keywords ?? []).some((keyword) =>
    normalizeText(keyword).startsWith(normalizedQuery)
  );
}

export function findTypeaheadMatch(
  records: readonly TypeaheadRecord[],
  query: string,
  currentId?: string | null
) {
  const enabledRecords = records.filter((record) => !record.disabled);
  if (enabledRecords.length === 0) {
    return null;
  }

  const currentIndex = enabledRecords.findIndex((record) => record.id === currentId);
  const orderedRecords =
    currentIndex >= 0
      ? [...enabledRecords.slice(currentIndex + 1), ...enabledRecords.slice(0, currentIndex + 1)]
      : enabledRecords;

  return orderedRecords.find((record) => matchesQuery(record, query)) ?? null;
}
