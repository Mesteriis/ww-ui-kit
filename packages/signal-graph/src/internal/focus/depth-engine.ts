import type {
  SignalGraphDepthMode,
  SignalGraphEdge,
  SignalGraphFocusSource,
  SignalGraphFocusState,
  SignalGraphNode,
} from '../../types';
import { buildRelationGraph, collectRelatedNodeIds } from './relation-graph';

export interface CreateSignalGraphFocusStateParams {
  nodes: readonly SignalGraphNode[];
  edges: readonly SignalGraphEdge[];
  anchorNodeId: string | null;
  source: SignalGraphFocusSource;
  depthMode: SignalGraphDepthMode;
  relationDepth?: number | undefined;
}

export function createSignalGraphFocusState({
  nodes,
  edges,
  anchorNodeId,
  source,
  depthMode,
  relationDepth,
}: CreateSignalGraphFocusStateParams): SignalGraphFocusState {
  const nodeIds = nodes.map((node) => node.id);

  if (!anchorNodeId || !nodeIds.includes(anchorNodeId)) {
    return {
      anchorNodeId: null,
      source: 'none',
      depthMode,
      relationDepth: depthMode === 'full' ? Math.max(1, relationDepth ?? 2) : 1,
      activeNodeIds: nodeIds,
      relatedNodeIds: [],
      backgroundNodeIds: [],
    };
  }

  if (depthMode === 'off') {
    return {
      anchorNodeId,
      source,
      depthMode,
      relationDepth: 0,
      activeNodeIds: nodeIds,
      relatedNodeIds: [],
      backgroundNodeIds: [],
    };
  }

  const resolvedDepth = depthMode === 'full' ? Math.max(1, relationDepth ?? 2) : 1;
  const relatedNodeIds = Array.from(
    collectRelatedNodeIds(buildRelationGraph(nodes, edges), anchorNodeId, resolvedDepth),
  );
  const backgroundNodeIds = nodeIds.filter(
    (nodeId) => nodeId !== anchorNodeId && !relatedNodeIds.includes(nodeId),
  );

  return {
    anchorNodeId,
    source,
    depthMode,
    relationDepth: resolvedDepth,
    activeNodeIds: [anchorNodeId],
    relatedNodeIds,
    backgroundNodeIds,
  };
}
