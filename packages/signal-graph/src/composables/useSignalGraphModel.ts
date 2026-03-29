import { computed, type Ref } from 'vue';

import { mapSignalEdges } from '../internal/adapters/map-signal-edges';
import { mapSignalNodes } from '../internal/adapters/map-signal-nodes';
import {
  createSignalGraphNodeTypes,
  signalGraphEdgeTypes,
} from '../internal/adapters/vue-flow-adapter';
import type {
  SignalGraphEdge,
  SignalGraphInteractionMode,
  SignalGraphNode,
  SignalGraphNodeDefinition,
} from '../types';

export interface UseSignalGraphModelParams {
  nodes: Ref<SignalGraphNode[]>;
  edges: Ref<SignalGraphEdge[]>;
  nodeDefinitions: Ref<Record<string, SignalGraphNodeDefinition>>;
  interactionMode: Ref<SignalGraphInteractionMode>;
}

export function useSignalGraphModel({
  nodes,
  edges,
  nodeDefinitions,
  interactionMode,
}: UseSignalGraphModelParams) {
  const nodeMap = computed(() => new Map(nodes.value.map((node) => [node.id, node])));
  const edgeMap = computed(() => new Map(edges.value.map((edge) => [edge.id, edge])));
  const flowNodes = computed(() =>
    mapSignalNodes(nodes.value, nodeDefinitions.value, interactionMode.value)
  );
  const flowEdges = computed(() => mapSignalEdges(edges.value));
  const nodeTypes = computed(() => createSignalGraphNodeTypes(nodes.value, nodeDefinitions.value));

  return {
    edgeMap,
    flowEdges,
    flowNodes,
    nodeMap,
    nodeTypes,
    edgeTypes: signalGraphEdgeTypes,
  };
}
