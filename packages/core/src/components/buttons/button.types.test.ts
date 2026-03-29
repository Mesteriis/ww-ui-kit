import { describe, expect, it } from 'vitest';

import { resolveButtonStyle } from './button.types';

describe('resolveButtonStyle', () => {
  it('supports legacy variants, tone aliases, and explicit appearances', () => {
    expect(resolveButtonStyle({})).toEqual({
      tone: 'brand',
      appearance: 'solid'
    });

    expect(resolveButtonStyle({ variant: 'secondary' })).toEqual({
      tone: 'neutral',
      appearance: 'outline'
    });

    expect(resolveButtonStyle({ variant: 'ghost' })).toEqual({
      tone: 'neutral',
      appearance: 'ghost'
    });

    expect(resolveButtonStyle({ tone: 'warn' })).toEqual({
      tone: 'warning',
      appearance: 'solid'
    });

    expect(resolveButtonStyle({ tone: 'fatal', appearance: 'ghost' })).toEqual({
      tone: 'critical',
      appearance: 'ghost'
    });
  });
});
