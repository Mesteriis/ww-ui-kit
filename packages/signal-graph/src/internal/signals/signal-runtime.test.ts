import { computed, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createSignalGraphSignalRuntime } from './signal-runtime';

describe('createSignalGraphSignalRuntime', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('queues signals deterministically, completes them, and keeps zero-motion path calm', () => {
    vi.useFakeTimers();

    const completedSignals: string[] = [];
    const runtime = createSignalGraphSignalRuntime({
      signals: ref(undefined),
      edgeMap: computed(
        () => new Map([['edge-a-b', { id: 'edge-a-b', source: 'a', target: 'b' }]])
      ),
      reducedMotion: ref(false),
      defaultDurationMs: ref(600),
      staggerMs: ref(80),
      nodeReactionDurationMs: ref(220),
      onSignalComplete: (signal) => completedSignals.push(signal.id),
    });

    runtime.emitSignal([
      {
        id: 'signal-1',
        edgeId: 'edge-a-b',
        variant: 'info',
        direction: 'forward',
        intensity: 'sm',
      },
      {
        id: 'signal-2',
        edgeId: 'edge-a-b',
        variant: 'success',
        direction: 'forward',
        intensity: 'md',
      },
    ]);

    expect(runtime.runtimeSignals.value).toHaveLength(2);
    expect(runtime.runtimeSignals.value[1]?.delayMs).toBe(80);

    vi.advanceTimersByTime(700);

    expect(completedSignals).toContain('signal-1');
    expect(runtime.reactingNodeIds.value.has('b')).toBe(true);

    vi.advanceTimersByTime(400);

    expect(runtime.runtimeSignals.value).toHaveLength(0);
    expect(runtime.reactingNodeIds.value.size).toBe(0);

    const reducedRuntime = createSignalGraphSignalRuntime({
      signals: ref(undefined),
      edgeMap: computed(
        () => new Map([['edge-a-b', { id: 'edge-a-b', source: 'a', target: 'b' }]])
      ),
      reducedMotion: ref(true),
      defaultDurationMs: ref(900),
      staggerMs: ref(120),
      nodeReactionDurationMs: ref(220),
    });

    reducedRuntime.emitSignal({
      id: 'signal-reduced',
      edgeId: 'edge-a-b',
      variant: 'warning',
      direction: 'forward',
      intensity: 'lg',
    });

    expect(reducedRuntime.runtimeSignals.value[0]?.delayMs).toBe(0);
    expect(reducedRuntime.runtimeSignals.value[0]?.durationMs).toBe(180);
  });

  it('dedupes incoming signals, reacts to watched props, and clears runtime state manually', async () => {
    vi.useFakeTimers();

    const incomingSignals = ref([
      {
        id: 'signal-1',
        edgeId: 'edge-a-b',
        variant: 'info',
        direction: 'forward',
        intensity: 'sm' as const,
      },
    ]);

    const runtime = createSignalGraphSignalRuntime({
      signals: incomingSignals,
      edgeMap: computed(
        () =>
          new Map([
            ['edge-a-b', { id: 'edge-a-b', source: 'a', target: 'b' }],
            ['edge-missing-target', { id: 'edge-missing-target', source: 'b', target: 'c' }],
          ])
      ),
      reducedMotion: ref(false),
      defaultDurationMs: ref(400),
      staggerMs: ref(40),
      nodeReactionDurationMs: ref(120),
    });

    expect(runtime.runtimeSignals.value).toHaveLength(1);

    incomingSignals.value = [
      {
        id: 'signal-1',
        edgeId: 'edge-a-b',
        variant: 'info',
        direction: 'forward',
        intensity: 'sm',
      },
      {
        id: 'signal-2',
        edgeId: 'edge-missing-target',
        variant: 'danger',
        direction: 'reverse',
        intensity: 'lg',
      },
    ];
    await nextTick();

    expect(runtime.runtimeSignals.value).toHaveLength(2);
    expect(runtime.runtimeSignalsByEdge.value.get('edge-a-b')).toHaveLength(1);
    expect(runtime.runtimeSignalsByEdge.value.get('edge-missing-target')).toHaveLength(1);

    runtime.clearSignals();
    expect(runtime.runtimeSignals.value).toEqual([]);
    expect(runtime.reactingNodeIds.value.size).toBe(0);
  });

  it('groups repeated edge signals, ignores duplicate ids, and supports windowless cleanup', () => {
    vi.useFakeTimers();

    const originalWindow = globalThis.window;
    const runtime = createSignalGraphSignalRuntime({
      signals: ref(undefined),
      edgeMap: computed(
        () => new Map([['edge-a-b', { id: 'edge-a-b', source: 'a', target: 'b' }]])
      ),
      reducedMotion: ref(false),
      defaultDurationMs: ref(400),
      staggerMs: ref(40),
      nodeReactionDurationMs: ref(120),
    });

    runtime.emitSignal({
      id: 'duplicate',
      edgeId: 'edge-a-b',
      variant: 'success',
      direction: 'forward',
      intensity: 'sm',
    });
    runtime.emitSignal({
      id: 'duplicate',
      edgeId: 'edge-a-b',
      variant: 'success',
      direction: 'forward',
      intensity: 'sm',
    });
    runtime.emitSignal({
      id: 'second',
      edgeId: 'edge-a-b',
      variant: 'warning',
      direction: 'reverse',
      intensity: 'lg',
    });

    expect(runtime.runtimeSignals.value).toHaveLength(2);
    expect(runtime.runtimeSignalsByEdge.value.get('edge-a-b')).toHaveLength(2);

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: undefined,
    });
    runtime.clearSignals();
    expect(runtime.runtimeSignals.value).toEqual([]);

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: originalWindow,
    });
  });

  it('completes reduced-motion signals without a target reaction and tolerates missing edge lookups', () => {
    vi.useFakeTimers();

    const completedSignals: string[] = [];
    const runtime = createSignalGraphSignalRuntime({
      signals: ref(undefined),
      edgeMap: computed(() => new Map()),
      reducedMotion: ref(true),
      defaultDurationMs: ref(500),
      staggerMs: ref(50),
      nodeReactionDurationMs: ref(200),
      onSignalComplete: (signal) => completedSignals.push(signal.id),
    });

    runtime.emitSignal({
      id: 'missing-edge',
      edgeId: 'missing-edge',
      variant: 'accent',
      direction: 'forward',
      intensity: 'md',
    });

    expect(runtime.runtimeSignals.value[0]?.delayMs).toBe(0);
    vi.advanceTimersByTime(181);

    expect(runtime.runtimeSignals.value).toEqual([]);
    expect(runtime.reactingNodeIds.value.size).toBe(0);
    expect(completedSignals).toEqual(['missing-edge']);

    runtime.clearSignals();
    expect(runtime.runtimeSignals.value).toEqual([]);
  });

  it('uses the reduced-motion node reaction duration when a signal reaches its target', () => {
    vi.useFakeTimers();

    const runtime = createSignalGraphSignalRuntime({
      signals: ref(undefined),
      edgeMap: computed(
        () => new Map([['edge-a-b', { id: 'edge-a-b', source: 'a', target: 'b' }]])
      ),
      reducedMotion: ref(true),
      defaultDurationMs: ref(500),
      staggerMs: ref(50),
      nodeReactionDurationMs: ref(400),
    });

    runtime.emitSignal({
      id: 'reduced-target',
      edgeId: 'edge-a-b',
      variant: 'info',
      direction: 'forward',
      intensity: 'md',
    });

    vi.advanceTimersByTime(180);
    expect(runtime.reactingNodeIds.value.has('b')).toBe(true);

    vi.advanceTimersByTime(139);
    expect(runtime.reactingNodeIds.value.has('b')).toBe(true);

    vi.advanceTimersByTime(2);
    expect(runtime.reactingNodeIds.value.has('b')).toBe(false);
  });

  it('tolerates late completion callbacks after the signal queue was cleared', () => {
    vi.useFakeTimers();

    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const completedSignals: string[] = [];
    const runtime = createSignalGraphSignalRuntime({
      signals: ref(undefined),
      edgeMap: computed(
        () => new Map([['edge-a-b', { id: 'edge-a-b', source: 'a', target: 'b' }]])
      ),
      reducedMotion: ref(false),
      defaultDurationMs: ref(500),
      staggerMs: ref(50),
      nodeReactionDurationMs: ref(200),
      onSignalComplete: (signal) => completedSignals.push(signal.id),
    });

    runtime.emitSignal({
      id: 'late-completion',
      edgeId: 'edge-a-b',
      variant: 'success',
      direction: 'forward',
      intensity: 'sm',
    });

    const queuedCallback = setTimeoutSpy.mock.calls[0]?.[0];
    if (typeof queuedCallback !== 'function') {
      throw new Error('Expected a queued timeout callback.');
    }

    runtime.clearSignals();
    queuedCallback();

    expect(runtime.runtimeSignals.value).toEqual([]);
    expect(completedSignals).toEqual(['late-completion']);
  });
});
