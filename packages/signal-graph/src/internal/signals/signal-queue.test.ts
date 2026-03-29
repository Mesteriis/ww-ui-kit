import { describe, expect, it, vi } from 'vitest';

import { normalizeSignalQueueEntries } from './signal-queue';

describe('normalizeSignalQueueEntries', () => {
  it('stacks concurrent signals per edge and resolves durations, delays, and targets', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000);

    const entries = normalizeSignalQueueEntries({
      edgeMap: new Map([
        ['edge-a-b', { id: 'edge-a-b', source: 'a', target: 'b' }]
      ]),
      existingSignals: [
        {
          id: 'existing',
          edgeId: 'edge-a-b',
          variant: 'info',
          direction: 'forward',
          intensity: 'sm',
          durationMs: 600,
          startedAt: 1,
          delayMs: 0,
          targetNodeId: 'b',
          signal: { id: 'existing', edgeId: 'edge-a-b', variant: 'info', direction: 'forward', intensity: 'sm' }
        }
      ],
      incomingSignals: [
        { id: 'signal-1', edgeId: 'edge-a-b', variant: 'success', direction: 'forward', intensity: 'md' },
        { id: 'signal-2', edgeId: 'edge-missing', variant: 'warning', direction: 'reverse', intensity: 'lg', durationMs: 900, startedAt: 5 }
      ],
      defaultDurationMs: 500,
      staggerMs: 80,
      reducedMotion: false
    });

    expect(entries[0]).toMatchObject({
      id: 'signal-1',
      durationMs: 500,
      delayMs: 80,
      targetNodeId: 'b',
      startedAt: 1700000000000
    });
    expect(entries[1]).toMatchObject({
      id: 'signal-2',
      durationMs: 900,
      delayMs: 0,
      targetNodeId: null,
      startedAt: 5
    });
  });

  it('short-circuits staggering under reduced motion', () => {
    const entries = normalizeSignalQueueEntries({
      edgeMap: new Map(),
      existingSignals: [],
      incomingSignals: [
        { id: 'signal-1', edgeId: 'edge', variant: 'neutral', direction: 'forward', intensity: 'sm', durationMs: 900 }
      ],
      defaultDurationMs: 600,
      staggerMs: 120,
      reducedMotion: true
    });

    expect(entries[0]?.durationMs).toBe(180);
    expect(entries[0]?.delayMs).toBe(0);
  });
});
