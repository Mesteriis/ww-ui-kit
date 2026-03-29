import type { SignalGraphEdge, SignalGraphNode } from '../../types';

export interface SignalGraphRelationGraph {
  adjacency: Map<string, Set<string>>;
}

export function buildRelationGraph(
  nodes: readonly SignalGraphNode[],
  edges: readonly SignalGraphEdge[]
): SignalGraphRelationGraph {
  const adjacency = new Map<string, Set<string>>();

  for (const node of nodes) {
    adjacency.set(node.id, new Set<string>());
  }

  for (const edge of edges) {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, new Set<string>());
    }

    if (!adjacency.has(edge.target)) {
      adjacency.set(edge.target, new Set<string>());
    }

    adjacency.get(edge.source)?.add(edge.target);
    adjacency.get(edge.target)?.add(edge.source);
  }

  return {
    adjacency,
  };
}

export function collectRelatedNodeIds(
  graph: SignalGraphRelationGraph,
  anchorNodeId: string,
  depth: number
): Set<string> {
  const relatedNodeIds = new Set<string>();
  const queue: Array<{ depth: number; nodeId: string }> = [{ depth: 0, nodeId: anchorNodeId }];
  const visited = new Set<string>([anchorNodeId]);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.depth >= depth) {
      continue;
    }

    const neighbors = graph.adjacency.get(current.nodeId);
    if (!neighbors) {
      continue;
    }

    for (const neighborId of neighbors) {
      if (visited.has(neighborId)) {
        continue;
      }

      visited.add(neighborId);
      relatedNodeIds.add(neighborId);
      queue.push({
        depth: current.depth + 1,
        nodeId: neighborId,
      });
    }
  }

  return relatedNodeIds;
}
