import { describe, expect, it } from 'vitest';

import { hasExactTextMatch, normalizeTextForExactMatch } from '../shared/perf';

describe('perf text matching', () => {
  it('normalizes whitespace before exact matching', () => {
    expect(normalizeTextForExactMatch('  Rows:\n  1  ')).toBe('Rows: 1');
  });

  it('matches exact success text across candidate strings', () => {
    expect(hasExactTextMatch(['Rows: 10', 'Rows: 1', 'Rows: 12'], 'Rows: 1')).toBe(true);
  });

  it('rejects partial text matches that previously passed with includes()', () => {
    expect(hasExactTextMatch(['Rows: 10', 'Rows: 11'], 'Rows: 1')).toBe(false);
  });

  it('matches nested text content when a descendant resolves to the exact text', () => {
    expect(hasExactTextMatch(['Queue Summary', 'Rows: 1', 'Selected: bravo'], 'Rows: 1')).toBe(
      true
    );
  });
});
