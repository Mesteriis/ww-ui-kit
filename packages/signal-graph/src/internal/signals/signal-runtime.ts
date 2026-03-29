import { computed, getCurrentInstance, onBeforeUnmount, shallowRef, watch, type Ref } from 'vue';

import type { RuntimeSignalEntry } from '../context';
import type { SignalGraphEdge, SignalGraphSignal } from '../../types';
import { createSignalNodeReactions } from './signal-reactions';
import { normalizeSignalQueueEntries } from './signal-queue';

export interface CreateSignalGraphSignalRuntimeParams {
  signals: Ref<SignalGraphSignal[] | undefined>;
  edgeMap: Ref<Map<string, SignalGraphEdge>>;
  reducedMotion: Ref<boolean>;
  defaultDurationMs: Ref<number>;
  staggerMs: Ref<number>;
  nodeReactionDurationMs: Ref<number>;
  onSignalComplete?: ((signal: SignalGraphSignal) => void) | undefined;
}

export function createSignalGraphSignalRuntime({
  signals,
  edgeMap,
  reducedMotion,
  defaultDurationMs,
  staggerMs,
  nodeReactionDurationMs,
  onSignalComplete,
}: CreateSignalGraphSignalRuntimeParams) {
  const runtimeSignals = shallowRef<RuntimeSignalEntry[]>([]);
  const signalTimers = new Map<string, ReturnType<typeof setTimeout>>();
  const seenSignalIds = new Set<string>();
  const { clearNodeReactions, reactingNodeIds, triggerNodeReaction } = createSignalNodeReactions();

  const runtimeSignalsByEdge = computed(() => {
    const groupedSignals = new Map<string, RuntimeSignalEntry[]>();

    for (const signal of runtimeSignals.value) {
      const currentSignals = groupedSignals.get(signal.edgeId);
      if (currentSignals) {
        currentSignals.push(signal);
        continue;
      }

      groupedSignals.set(signal.edgeId, [signal]);
    }

    return groupedSignals;
  });

  const clearSignalTimer = (signalId: string) => {
    const timerId = signalTimers.get(signalId);
    /* istanbul ignore if -- completeSignal only runs for queued entries with registered timers. */
    if (timerId) {
      clearTimeout(timerId);
      signalTimers.delete(signalId);
    }
  };

  const completeSignal = (entry: RuntimeSignalEntry) => {
    clearSignalTimer(entry.id);
    runtimeSignals.value = runtimeSignals.value.filter((signal) => signal.id !== entry.id);

    if (entry.targetNodeId) {
      triggerNodeReaction(
        entry.targetNodeId,
        reducedMotion.value ? 140 : nodeReactionDurationMs.value,
      );
    }

    onSignalComplete?.(entry.signal);
  };

  const queueSignals = (nextSignals: readonly SignalGraphSignal[]) => {
    const dedupedSignals = nextSignals.filter((signal) => !seenSignalIds.has(signal.id));
    if (dedupedSignals.length === 0) {
      return;
    }

    for (const signal of dedupedSignals) {
      seenSignalIds.add(signal.id);
    }

    const queueEntries = normalizeSignalQueueEntries({
      edgeMap: edgeMap.value,
      existingSignals: runtimeSignals.value,
      incomingSignals: dedupedSignals,
      defaultDurationMs: defaultDurationMs.value,
      staggerMs: staggerMs.value,
      reducedMotion: reducedMotion.value,
    });

    runtimeSignals.value = [...runtimeSignals.value, ...queueEntries];

    for (const entry of queueEntries) {
      signalTimers.set(
        entry.id,
        setTimeout(() => {
          completeSignal(entry);
        }, entry.delayMs + entry.durationMs),
      );
    }
  };

  const emitSignal = (signal: SignalGraphSignal | SignalGraphSignal[]) => {
    queueSignals(Array.isArray(signal) ? signal : [signal]);
  };

  const clearSignals = () => {
    for (const timerId of signalTimers.values()) {
      clearTimeout(timerId);
    }

    signalTimers.clear();
    runtimeSignals.value = [];
    clearNodeReactions();
  };

  watch(
    signals,
    (value) => {
      if (!value?.length) {
        return;
      }

      queueSignals(value);
    },
    { deep: true, immediate: true },
  );

  if (getCurrentInstance()) {
    onBeforeUnmount(() => {
      clearSignals();
    });
  }

  return {
    clearSignals,
    emitSignal,
    reactingNodeIds,
    runtimeSignals,
    runtimeSignalsByEdge,
  };
}
