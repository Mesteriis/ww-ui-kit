import { MarkerType, type Edge } from '@vue-flow/core';

import type { SignalGraphEdge } from '../../types';
import { SIGNAL_GRAPH_EDGE_TYPE } from './vue-flow-adapter';

export interface SignalGraphVendorEdgeData {
  signalEdgeId: string;
  direction: SignalGraphEdge['direction'];
}

function resolveEdgeMarkerEnd(direction: SignalGraphEdge['direction']) {
  if (direction === 'reverse') {
    return undefined;
  }

  return {
    type: MarkerType.ArrowClosed,
  };
}

function resolveEdgeMarkerStart(direction: SignalGraphEdge['direction']) {
  if (direction !== 'reverse' && direction !== 'bidirectional') {
    return undefined;
  }

  return {
    type: MarkerType.ArrowClosed,
  };
}

export function mapSignalEdges(
  edges: readonly SignalGraphEdge[]
): Edge<SignalGraphVendorEdgeData>[] {
  return edges.map((edge) => {
    const mappedEdge: Edge<SignalGraphVendorEdgeData> = {
      id: edge.id,
      type: SIGNAL_GRAPH_EDGE_TYPE,
      source: edge.source,
      target: edge.target,
      selectable: false,
      focusable: false,
      updatable: false,
      animated: false,
      interactionWidth: 24,
      ariaLabel: edge.label ?? `${edge.source} to ${edge.target}`,
      data: {
        signalEdgeId: edge.id,
        direction: edge.direction,
      },
    };

    if (edge.label !== undefined) {
      mappedEdge.label = edge.label;
    }

    if (edge.className) {
      mappedEdge.class = edge.className;
    }

    const markerStart = resolveEdgeMarkerStart(edge.direction);
    if (markerStart) {
      mappedEdge.markerStart = markerStart;
    }

    const markerEnd = resolveEdgeMarkerEnd(edge.direction);
    if (markerEnd) {
      mappedEdge.markerEnd = markerEnd;
    }

    return mappedEdge;
  });
}
