import type { RuntimeSignalEntry } from '../context';
import type { SignalGraphEdge, SignalGraphSignal } from '../../types';

export interface NormalizeSignalQueueParams {
  edgeMap: Map<string, SignalGraphEdge>;
  existingSignals: readonly RuntimeSignalEntry[];
  incomingSignals: readonly SignalGraphSignal[];
  defaultDurationMs: number;
  staggerMs: number;
  reducedMotion: boolean;
}

export function normalizeSignalQueueEntries({
  edgeMap,
  existingSignals,
  incomingSignals,
  defaultDurationMs,
  staggerMs,
  reducedMotion,
}: NormalizeSignalQueueParams): RuntimeSignalEntry[] {
  const activeCounts = new Map<string, number>();

  for (const signal of existingSignals) {
    activeCounts.set(signal.edgeId, (activeCounts.get(signal.edgeId) ?? 0) + 1);
  }

  return incomingSignals.map((signal) => {
    const concurrentCount = activeCounts.get(signal.edgeId) ?? 0;
    activeCounts.set(signal.edgeId, concurrentCount + 1);

    const edge = edgeMap.get(signal.edgeId);
    const durationMs = signal.durationMs ?? defaultDurationMs;

    return {
      id: signal.id,
      edgeId: signal.edgeId,
      variant: signal.variant,
      direction: signal.direction,
      intensity: signal.intensity,
      durationMs: reducedMotion ? Math.min(durationMs, 180) : durationMs,
      startedAt: signal.startedAt ?? Date.now(),
      delayMs: reducedMotion ? 0 : concurrentCount * staggerMs,
      targetNodeId: edge?.target ?? null,
      signal,
    };
  });
}
