import { afterEach, describe, expect, it, vi } from 'vitest';

import { createSignalNodeReactions } from './signal-reactions';

describe('createSignalNodeReactions', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('tracks and clears node reactions, replacing existing timers when retriggered', () => {
    vi.useFakeTimers();

    const reactions = createSignalNodeReactions();

    reactions.triggerNodeReaction('node-a', 100);
    reactions.triggerNodeReaction('node-a', 200);
    reactions.triggerNodeReaction('node-b', 120);

    expect(reactions.reactingNodeIds.value).toEqual(new Set(['node-a', 'node-b']));

    vi.advanceTimersByTime(130);
    expect(reactions.reactingNodeIds.value.has('node-b')).toBe(false);
    expect(reactions.reactingNodeIds.value.has('node-a')).toBe(true);

    reactions.clearNodeReactions();
    expect(reactions.reactingNodeIds.value.size).toBe(0);
  });

  it('does nothing without window access', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error test-only override
    globalThis.window = undefined;

    const reactions = createSignalNodeReactions();
    reactions.triggerNodeReaction('node-a', 100);
    expect(reactions.reactingNodeIds.value.size).toBe(0);
    reactions.clearNodeReactions();

    // @ts-expect-error restore test-only override
    globalThis.window = originalWindow;
  });
});
