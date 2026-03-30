import { describe, expect, it } from 'vitest';

import { findTypeaheadMatch } from './typeahead';

describe('typeahead helpers', () => {
  it('matches labels and keywords while skipping disabled records', () => {
    const match = findTypeaheadMatch(
      [
        { id: 'alpha', label: 'Alpha' },
        { id: 'beta', label: 'Beta', disabled: true },
        { id: 'charlie', label: 'Charlie', keywords: ['deploy'] },
      ],
      'de',
      'alpha'
    );

    expect(match?.id).toBe('charlie');
  });

  it('rotates from the current record when a later match exists', () => {
    const match = findTypeaheadMatch(
      [
        { id: 'alpha', label: 'Alpha' },
        { id: 'bravo', label: 'Bravo' },
        { id: 'charlie', label: 'Charlie' },
      ],
      'c',
      'alpha'
    );

    expect(match?.id).toBe('charlie');
  });

  it('returns null for empty queries and when no enabled record matches', () => {
    expect(findTypeaheadMatch([{ id: 'alpha', label: 'Alpha' }], '')).toBeNull();
    expect(
      findTypeaheadMatch(
        [
          { id: 'alpha', label: 'Alpha', disabled: true },
          { id: 'beta', label: 'Beta', disabled: true },
        ],
        'a'
      )
    ).toBeNull();
  });
});
