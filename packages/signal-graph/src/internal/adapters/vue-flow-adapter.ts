import { markRaw } from 'vue';
import type { EdgeTypesObject, NodeTypesObject } from '@vue-flow/core';

import type { SignalGraphNode, SignalGraphNodeDefinition } from '../../types';
import SignalGraphEdge from '../edges/SignalGraphEdge.vue';
import SignalGraphNodeHost from '../nodes/SignalGraphNodeHost.vue';

export const SIGNAL_GRAPH_EDGE_TYPE = 'signal-graph-edge';

export function createSignalGraphNodeTypes(
  nodes: readonly SignalGraphNode[],
  nodeDefinitions: Record<string, SignalGraphNodeDefinition>
): NodeTypesObject {
  const uniqueTypes = new Set<string>();

  for (const node of nodes) {
    uniqueTypes.add(node.type);
  }

  for (const type of Object.keys(nodeDefinitions)) {
    uniqueTypes.add(type);
  }

  return Object.fromEntries(
    Array.from(uniqueTypes).map((type) => [type, markRaw(SignalGraphNodeHost)])
  ) as NodeTypesObject;
}

const signalGraphEdgeComponent = SignalGraphEdge as unknown as NonNullable<EdgeTypesObject[string]>;

export const signalGraphEdgeTypes: EdgeTypesObject = Object.freeze({
  [SIGNAL_GRAPH_EDGE_TYPE]: signalGraphEdgeComponent,
});
