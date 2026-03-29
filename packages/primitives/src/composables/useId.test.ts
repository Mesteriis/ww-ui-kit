import { describe, expect, it } from 'vitest';

import { useId } from './useId';

describe('useId', () => {
  it('generates sequential ids for default and custom prefixes', () => {
    const firstDefault = useId();
    const secondDefault = useId();
    const custom = useId('tabs');

    expect(firstDefault.value).toMatch(/^ui-\d+$/);
    expect(secondDefault.value).toMatch(/^ui-\d+$/);
    expect(custom.value).toMatch(/^tabs-\d+$/);

    expect(firstDefault.value).not.toBe(secondDefault.value);
    expect(secondDefault.value).not.toBe(custom.value);
  });
});
