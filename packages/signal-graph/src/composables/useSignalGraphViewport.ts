import type { VueFlowStore } from '@vue-flow/core';

import type { SignalGraphSignal } from '../types';
import {
  centerSignalGraphNode,
  fitSignalGraphView,
  resetSignalGraphViewport,
} from '../internal/viewport/viewport-controller';

export interface UseSignalGraphViewportParams {
  store: Pick<
    VueFlowStore,
    'findNode' | 'fitView' | 'getViewport' | 'setCenter' | 'setViewport' | 'zoomIn' | 'zoomOut'
  >;
  fitViewPadding: number | `${number}%` | undefined;
  defaultZoom: number | undefined;
  focusNode: (nodeId: string) => void;
  clearFocus: () => void;
  emitSignal: (signal: SignalGraphSignal | SignalGraphSignal[]) => void;
}

export function useSignalGraphViewport({
  store,
  fitViewPadding,
  defaultZoom,
  focusNode,
  clearFocus,
  emitSignal,
}: UseSignalGraphViewportParams) {
  return {
    fitView: () => fitSignalGraphView(store, fitViewPadding),
    centerNode: (nodeId: string) => centerSignalGraphNode(store, nodeId),
    focusNode,
    clearFocus,
    emitSignal,
    zoomIn: () => store.zoomIn(),
    zoomOut: () => store.zoomOut(),
    resetViewport: () => resetSignalGraphViewport(store, defaultZoom),
  };
}
