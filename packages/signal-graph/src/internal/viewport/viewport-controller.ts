import type { VueFlowStore } from '@vue-flow/core';

export type SignalGraphViewportStore = Pick<
  VueFlowStore,
  'findNode' | 'fitView' | 'getViewport' | 'setCenter' | 'setViewport' | 'zoomIn' | 'zoomOut'
>;

export function parseFitViewPadding(value: number | `${number}%` | undefined): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.endsWith('%')) {
    return Number.parseFloat(value) / 100;
  }

  return 0.12;
}

export function fitSignalGraphView(
  store: SignalGraphViewportStore,
  padding: number | `${number}%` | undefined,
) {
  return store.fitView({
    padding: parseFitViewPadding(padding),
  });
}

export async function centerSignalGraphNode(
  store: SignalGraphViewportStore,
  nodeId: string,
): Promise<boolean> {
  const node = store.findNode(nodeId);
  if (!node) {
    return false;
  }

  const viewport = store.getViewport();
  const x = node.computedPosition.x + node.dimensions.width / 2;
  const y = node.computedPosition.y + node.dimensions.height / 2;

  return store.setCenter(x, y, {
    duration: 220,
    zoom: viewport.zoom,
  });
}

export async function resetSignalGraphViewport(
  store: SignalGraphViewportStore,
  defaultZoom: number | undefined,
): Promise<boolean> {
  return store.setViewport(
    {
      x: 0,
      y: 0,
      zoom: defaultZoom ?? 1,
    },
    {
      duration: 180,
    },
  );
}
