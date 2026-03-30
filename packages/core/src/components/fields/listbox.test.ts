import { describe, expect, it } from 'vitest';

import {
  findAdjacentListboxRecord,
  findBoundaryListboxRecord,
  findListboxTypeaheadRecord,
  filterListboxRecords,
} from './listbox';

const records = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'bravo', label: 'Bravo', disabled: true },
  { id: 'charlie', label: 'Charlie', keywords: ['deploy'] },
];

describe('listbox helpers', () => {
  it('filters by label and keywords', () => {
    expect(filterListboxRecords(records, 'de')).toHaveLength(1);
    expect(filterListboxRecords(records, '')).toHaveLength(3);
    expect(filterListboxRecords(records, 'pha')).toHaveLength(1);
  });

  it('finds adjacent, boundary, and typeahead matches', () => {
    expect(findAdjacentListboxRecord(records, 'alpha', 1)?.id).toBe('charlie');
    expect(findAdjacentListboxRecord(records, 'alpha', -1)?.id).toBe('alpha');
    expect(findAdjacentListboxRecord(records, 'charlie', 1)?.id).toBe('charlie');
    expect(findAdjacentListboxRecord(records, 'missing', 1)?.id).toBe('alpha');
    expect(findAdjacentListboxRecord(records, 'missing', -1)?.id).toBe('charlie');
    expect(findBoundaryListboxRecord(records, 'last')?.id).toBe('charlie');
    expect(findBoundaryListboxRecord(records, 'first')?.id).toBe('alpha');
    expect(findListboxTypeaheadRecord(records, 'ch', 'alpha')?.id).toBe('charlie');
    expect(findListboxTypeaheadRecord(records, 'zz')).toBeNull();
  });

  it('returns null when no enabled record is available', () => {
    const disabledRecords = [{ id: 'alpha', label: 'Alpha', disabled: true }];

    expect(findAdjacentListboxRecord(disabledRecords, null, 1)).toBeNull();
    expect(findBoundaryListboxRecord(disabledRecords, 'first')).toBeNull();
    expect(findListboxTypeaheadRecord(disabledRecords, 'a')).toBeNull();
  });
});
