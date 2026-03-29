import { describe, expect, it } from 'vitest';

import { buildRelationGraph, collectRelatedNodeIds } from './relation-graph';

const nodes = [
  { id: 'a', type: 'service', position: { x: 0, y: 0 }, data: {} },
  { id: 'b', type: 'service', position: { x: 240, y: 0 }, data: {} }
];

describe('signal graph relation graph', () => {
  it('builds adjacency for known and missing nodes referenced by edges', () => {
    const graph = buildRelationGraph(nodes, [
      { id: 'za', source: 'z', target: 'a' },
      { id: 'ab', source: 'a', target: 'b' },
      { id: 'bc', source: 'b', target: 'c' }
    ]);

    expect(graph.adjacency.get('z')).toEqual(new Set(['a']));
    expect(graph.adjacency.get('a')).toEqual(new Set(['z', 'b']));
    expect(graph.adjacency.get('b')).toEqual(new Set(['a', 'c']));
    expect(graph.adjacency.get('c')).toEqual(new Set(['b']));
  });

  it('collects related nodes up to the requested depth and ignores missing adjacency', () => {
    const graph = buildRelationGraph(nodes, [
      { id: 'ab', source: 'a', target: 'b' },
      { id: 'bc', source: 'b', target: 'c' }
    ]);

    expect(collectRelatedNodeIds(graph, 'a', 0)).toEqual(new Set());
    expect(collectRelatedNodeIds(graph, 'a', 1)).toEqual(new Set(['b']));
    expect(collectRelatedNodeIds(graph, 'a', 2)).toEqual(new Set(['b', 'c']));
    expect(collectRelatedNodeIds({ adjacency: new Map() }, 'missing', 3)).toEqual(new Set());
  });
});
