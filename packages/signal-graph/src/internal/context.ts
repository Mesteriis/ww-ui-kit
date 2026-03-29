import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type {
  SignalGraphDepthMode,
  SignalGraphDepthState,
  SignalGraphEdge,
  SignalGraphFocusState,
  SignalGraphHandle,
  SignalGraphInteractionMode,
  SignalGraphNode,
  SignalGraphNodeDefinition,
  SignalGraphSignal,
  SignalGraphThemeState,
} from '../types';

export interface RuntimeSignalEntry {
  id: string;
  edgeId: string;
  variant: SignalGraphSignal['variant'];
  direction: SignalGraphSignal['direction'];
  intensity: SignalGraphSignal['intensity'];
  durationMs: number;
  startedAt: number;
  delayMs: number;
  targetNodeId: string | null;
  signal: SignalGraphSignal;
}

export interface SignalGraphRuntimeContext {
  nodeMap: ComputedRef<Map<string, SignalGraphNode>>;
  edgeMap: ComputedRef<Map<string, SignalGraphEdge>>;
  nodeDefinitions: ComputedRef<Record<string, SignalGraphNodeDefinition>>;
  focusState: ComputedRef<SignalGraphFocusState>;
  depthMode: Ref<SignalGraphDepthMode>;
  interactionMode: Ref<SignalGraphInteractionMode>;
  runtimeSignalsByEdge: ComputedRef<Map<string, RuntimeSignalEntry[]>>;
  reactingNodeIds: Ref<Set<string>>;
  reducedMotion: Ref<boolean>;
  themeState: Ref<SignalGraphThemeState>;
  graphApi: Pick<SignalGraphHandle, 'centerNode' | 'clearFocus' | 'emitSignal' | 'focusNode'>;
}

export const signalGraphRuntimeKey = Symbol(
  'signal-graph-runtime'
) as InjectionKey<SignalGraphRuntimeContext>;

export function resolveNodeDepthState(
  nodeId: string,
  focusState: SignalGraphFocusState
): SignalGraphDepthState {
  if (!focusState.anchorNodeId) {
    return 'active';
  }

  if (focusState.depthMode === 'off') {
    return 'active';
  }

  if (focusState.anchorNodeId === nodeId) {
    return 'active';
  }

  if (focusState.relatedNodeIds.includes(nodeId)) {
    return 'related';
  }

  return 'background';
}

export function resolveEdgeDepthState(
  edge: SignalGraphEdge,
  focusState: SignalGraphFocusState
): SignalGraphDepthState {
  if (!focusState.anchorNodeId) {
    return 'active';
  }

  if (focusState.depthMode === 'off') {
    return 'active';
  }

  if (edge.source === focusState.anchorNodeId || edge.target === focusState.anchorNodeId) {
    return 'active';
  }

  if (
    focusState.relatedNodeIds.includes(edge.source) ||
    focusState.relatedNodeIds.includes(edge.target)
  ) {
    return 'related';
  }

  return 'background';
}
