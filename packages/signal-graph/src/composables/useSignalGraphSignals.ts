import { computed, type Ref } from 'vue';

import { createSignalGraphSignalRuntime } from '../internal/signals/signal-runtime';
import type { SignalGraphEdge, SignalGraphOptions, SignalGraphSignal } from '../types';

export interface UseSignalGraphSignalsParams {
  signals: Ref<SignalGraphSignal[] | undefined>;
  edgeMap: Ref<Map<string, SignalGraphEdge>>;
  reducedMotion: Ref<boolean>;
  options: Ref<SignalGraphOptions | undefined>;
  onSignalComplete?: ((signal: SignalGraphSignal) => void) | undefined;
}

export function useSignalGraphSignals({
  signals,
  edgeMap,
  reducedMotion,
  options,
  onSignalComplete,
}: UseSignalGraphSignalsParams) {
  return createSignalGraphSignalRuntime({
    signals,
    edgeMap,
    reducedMotion,
    defaultDurationMs: computed(() => options.value?.signalDurationMs ?? 1200),
    staggerMs: computed(() => options.value?.signalStaggerMs ?? 90),
    nodeReactionDurationMs: computed(() => options.value?.nodeReactionDurationMs ?? 460),
    onSignalComplete,
  });
}
