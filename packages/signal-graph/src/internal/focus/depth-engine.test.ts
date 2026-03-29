import { describe, expect, it } from 'vitest';

import { createSignalGraphFocusState } from './depth-engine';

const nodes = [
  { id: 'a', type: 'service', position: { x: 0, y: 0 }, data: {} },
  { id: 'b', type: 'service', position: { x: 200, y: 0 }, data: {} },
  { id: 'c', type: 'service', position: { x: 400, y: 0 }, data: {} },
];

const edges = [
  { id: 'ab', source: 'a', target: 'b' },
  { id: 'bc', source: 'b', target: 'c' },
];

describe('createSignalGraphFocusState', () => {
  it('derives active, related, and background nodes for full mode', () => {
    const focusState = createSignalGraphFocusState({
      nodes,
      edges,
      anchorNodeId: 'a',
      source: 'selection',
      depthMode: 'full',
      relationDepth: 2,
    });

    expect(focusState.activeNodeIds).toEqual(['a']);
    expect(focusState.relatedNodeIds).toEqual(['b', 'c']);
    expect(focusState.backgroundNodeIds).toEqual([]);
  });

  it('disables dimming in off mode while preserving the anchor', () => {
    const focusState = createSignalGraphFocusState({
      nodes,
      edges,
      anchorNodeId: 'b',
      source: 'programmatic',
      depthMode: 'off',
      relationDepth: 3,
    });

    expect(focusState.anchorNodeId).toBe('b');
    expect(focusState.activeNodeIds).toEqual(['a', 'b', 'c']);
    expect(focusState.relatedNodeIds).toEqual([]);
    expect(focusState.backgroundNodeIds).toEqual([]);
  });

  it('uses default relation depth for invalid or partial focus inputs', () => {
    const invalidAnchor = createSignalGraphFocusState({
      nodes,
      edges,
      anchorNodeId: 'missing',
      source: 'selection',
      depthMode: 'full',
      relationDepth: undefined,
    });

    expect(invalidAnchor.anchorNodeId).toBeNull();
    expect(invalidAnchor.relationDepth).toBe(2);

    const liteDepth = createSignalGraphFocusState({
      nodes,
      edges,
      anchorNodeId: 'a',
      source: 'hover',
      depthMode: 'lite',
      relationDepth: 5,
    });

    expect(liteDepth.relationDepth).toBe(1);
    expect(liteDepth.relatedNodeIds).toEqual(['b']);
    expect(liteDepth.backgroundNodeIds).toEqual(['c']);

    const invalidLite = createSignalGraphFocusState({
      nodes,
      edges,
      anchorNodeId: 'missing',
      source: 'selection',
      depthMode: 'lite',
      relationDepth: undefined,
    });

    expect(invalidLite.relationDepth).toBe(1);
  });
});
