import { describe, expect, it } from 'vitest';

import {
  findMenuItemByKey,
  findMenuTypeaheadMatch,
  flattenMenuItems,
  normalizeMenuItems,
} from './menu-model';

describe('menu model helpers', () => {
  it('normalizes groups, dividers, and item ids', () => {
    const normalized = normalizeMenuItems([
      { label: 'Alpha', value: 'alpha' },
      { type: 'divider' },
      {
        type: 'group',
        label: 'Deploy',
        items: [
          { key: 'charlie', label: 'Charlie', value: 'charlie' },
          { label: 'Docs', to: '/docs' },
        ],
      },
    ]);

    expect(normalized).toHaveLength(3);
    expect(flattenMenuItems(normalized)).toHaveLength(3);
    expect(findMenuItemByKey(normalized, 'charlie')?.label).toBe('Charlie');
    expect(findMenuTypeaheadMatch(flattenMenuItems(normalized), 'ch')?.id).toBe('charlie');
    expect(findMenuItemByKey(normalized, 'item-2-group-1')?.href).toBe('/docs');
    expect(findMenuTypeaheadMatch(flattenMenuItems(normalized), 'do')?.id).toBe('item-2-group-1');
  });

  it('returns null when a menu item key does not exist', () => {
    const normalized = normalizeMenuItems([
      {
        type: 'group',
        label: 'Nested',
        items: [{ label: 'Alpha' }],
      },
    ]);

    expect(findMenuItemByKey(normalized, 'missing')).toBeNull();
  });
});
