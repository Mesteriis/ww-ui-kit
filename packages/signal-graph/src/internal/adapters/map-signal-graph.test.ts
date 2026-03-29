import { defineComponent } from 'vue';
import { describe, expect, it } from 'vitest';

import { mapSignalEdges } from './map-signal-edges';
import { mapSignalNodes } from './map-signal-nodes';
import { createSignalGraphNodeDefinition } from '../../types';

describe('signal graph adapters', () => {
  it('maps signal graph nodes and edges without mutating source input', () => {
    const nodeDefinitions = {
      service: createSignalGraphNodeDefinition({
        component: defineComponent({
          render() {
            return null;
          },
        }),
        draggable: false,
        minHeight: 120,
        minWidth: 240,
      }),
    };
    const nodes = [
      {
        id: 'a',
        type: 'service',
        position: { x: 24, y: 48 },
        data: { status: 'healthy' },
        className: 'custom-node',
      },
    ] as const;
    const edges = [
      {
        id: 'edge-a-b',
        source: 'a',
        target: 'b',
        label: 'sync',
        direction: 'forward',
      },
    ] as const;
    const nodesSnapshot = structuredClone(nodes);
    const edgesSnapshot = structuredClone(edges);

    const mappedNodes = mapSignalNodes(nodes, nodeDefinitions, 'interactive');
    const mappedEdges = mapSignalEdges(edges);

    expect(mappedNodes[0]).toMatchObject({
      id: 'a',
      type: 'service',
      position: { x: 24, y: 48 },
      width: 240,
      height: 120,
      class: 'custom-node',
      draggable: false,
    });
    expect(mappedEdges[0]).toMatchObject({
      id: 'edge-a-b',
      source: 'a',
      target: 'b',
      label: 'sync',
    });
    expect(nodes).toEqual(nodesSnapshot);
    expect(edges).toEqual(edgesSnapshot);
  });

  it('covers readonly node mapping, focusability fallbacks, and edge marker variants', () => {
    const nodeDefinitions = {
      service: createSignalGraphNodeDefinition({
        component: defineComponent({
          render() {
            return null;
          },
        }),
        focusable: false,
        label: 'Service node',
      }),
    };

    const mappedNodes = mapSignalNodes(
      [
        {
          id: 'parent',
          type: 'service',
          position: { x: 0, y: 0 },
          data: {},
          parentNodeId: 'root',
          zIndex: 12,
          width: 280,
          height: 140,
        },
      ],
      nodeDefinitions,
      'readonly'
    );
    const [node] = mappedNodes;

    expect(node).toMatchObject({
      draggable: false,
      focusable: false,
      width: 280,
      height: 140,
      zIndex: 12,
      parentNode: 'root',
      ariaLabel: 'Service node',
    });

    const mappedEdges = mapSignalEdges([
      { id: 'reverse', source: 'a', target: 'b', direction: 'reverse', className: 'reverse-edge' },
      { id: 'bidi', source: 'b', target: 'c', direction: 'bidirectional' },
      { id: 'forward', source: 'c', target: 'd', direction: 'forward', label: undefined },
    ]);

    expect(mappedEdges[0]).toMatchObject({
      class: 'reverse-edge',
      markerStart: { type: 'arrowclosed' },
    });
    expect(mappedEdges[0]?.markerEnd).toBeUndefined();
    expect(mappedEdges[1]?.markerStart).toEqual({ type: 'arrowclosed' });
    expect(mappedEdges[1]?.markerEnd).toEqual({ type: 'arrowclosed' });
    expect(mappedEdges[2]?.markerStart).toBeUndefined();
    expect(mappedEdges[2]?.markerEnd).toEqual({ type: 'arrowclosed' });
  });
});
