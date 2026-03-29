import { computed, ref, watch, type Ref } from 'vue';

import { useControllable } from '@ww/primitives';

import { createSignalGraphFocusState } from '../internal/focus/depth-engine';
import type {
  SignalGraphDepthMode,
  SignalGraphEdge,
  SignalGraphFocusSource,
  SignalGraphFocusState,
  SignalGraphNode,
} from '../types';

export interface UseSignalGraphFocusParams {
  nodes: Ref<SignalGraphNode[]>;
  edges: Ref<SignalGraphEdge[]>;
  depthMode: Ref<SignalGraphDepthMode>;
  focusedNodeId: Ref<string | null | undefined>;
  relationDepth: Ref<number | undefined>;
  onFocusChange?: ((focusedNodeId: string | null) => void) | undefined;
  onFocusStateChange?: ((focusState: SignalGraphFocusState) => void) | undefined;
}

export function useSignalGraphFocus({
  nodes,
  edges,
  depthMode,
  focusedNodeId,
  relationDepth,
  onFocusChange,
  onFocusStateChange,
}: UseSignalGraphFocusParams) {
  const hoveredNodeId = ref<string | null>(null);
  const focusSource = ref<SignalGraphFocusSource>('none');
  const { currentValue, setValue } = useControllable<string | null>({
    value: focusedNodeId,
    defaultValue: null,
    ...(onFocusChange ? { onChange: onFocusChange } : {}),
  });

  const anchorNodeId = computed(() => currentValue.value ?? hoveredNodeId.value ?? null);
  const resolvedSource = computed<SignalGraphFocusSource>(() => {
    if (currentValue.value) {
      if (focusedNodeId.value !== undefined) {
        return 'controlled';
      }

      return focusSource.value === 'none' ? 'selection' : focusSource.value;
    }

    if (hoveredNodeId.value) {
      return 'hover';
    }

    return 'none';
  });

  const focusState = computed(() =>
    createSignalGraphFocusState({
      nodes: nodes.value,
      edges: edges.value,
      anchorNodeId: anchorNodeId.value,
      source: resolvedSource.value,
      depthMode: depthMode.value,
      relationDepth: relationDepth.value,
    }),
  );

  const focusNode = (nodeId: string, source: SignalGraphFocusSource = 'programmatic') => {
    focusSource.value = source;
    setValue(nodeId);
  };

  const clearFocus = () => {
    focusSource.value = 'none';
    setValue(null);
    hoveredNodeId.value = null;
  };

  const setHoveredNodeId = (nodeId: string | null) => {
    hoveredNodeId.value = nodeId;
  };

  const selectNode = (nodeId: string) => {
    focusNode(nodeId, 'selection');
  };

  watch(
    focusState,
    (value) => {
      onFocusStateChange?.(value);
    },
    { immediate: true },
  );

  return {
    anchorNodeId,
    clearFocus,
    focusNode,
    focusState,
    selectNode,
    setHoveredNodeId,
  };
}
