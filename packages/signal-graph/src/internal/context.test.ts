import { describe, expect, it } from 'vitest';

import { resolveEdgeDepthState, resolveNodeDepthState } from './context';

describe('signal graph runtime context helpers', () => {
  it('derives node depth states for active, related, and background cases', () => {
    expect(
      resolveNodeDepthState('a', {
        anchorNodeId: null,
        source: 'none',
        depthMode: 'full',
        relationDepth: 1,
        activeNodeIds: [],
        relatedNodeIds: [],
        backgroundNodeIds: [],
      })
    ).toBe('active');

    expect(
      resolveNodeDepthState('a', {
        anchorNodeId: 'b',
        source: 'selection',
        depthMode: 'off',
        relationDepth: 1,
        activeNodeIds: ['b'],
        relatedNodeIds: [],
        backgroundNodeIds: [],
      })
    ).toBe('active');

    expect(
      resolveNodeDepthState('b', {
        anchorNodeId: 'b',
        source: 'selection',
        depthMode: 'full',
        relationDepth: 1,
        activeNodeIds: ['b'],
        relatedNodeIds: ['a'],
        backgroundNodeIds: ['c'],
      })
    ).toBe('active');

    expect(
      resolveNodeDepthState('a', {
        anchorNodeId: 'b',
        source: 'selection',
        depthMode: 'full',
        relationDepth: 1,
        activeNodeIds: ['b'],
        relatedNodeIds: ['a'],
        backgroundNodeIds: ['c'],
      })
    ).toBe('related');

    expect(
      resolveNodeDepthState('c', {
        anchorNodeId: 'b',
        source: 'selection',
        depthMode: 'full',
        relationDepth: 1,
        activeNodeIds: ['b'],
        relatedNodeIds: ['a'],
        backgroundNodeIds: ['c'],
      })
    ).toBe('background');
  });

  it('derives edge depth states from anchor and related nodes', () => {
    const focusState = {
      anchorNodeId: 'b',
      source: 'selection' as const,
      depthMode: 'full' as const,
      relationDepth: 1,
      activeNodeIds: ['b'],
      relatedNodeIds: ['a'],
      backgroundNodeIds: ['c'],
    };

    expect(resolveEdgeDepthState({ id: 'ab', source: 'b', target: 'c' }, focusState)).toBe(
      'active'
    );
    expect(resolveEdgeDepthState({ id: 'ac', source: 'a', target: 'c' }, focusState)).toBe(
      'related'
    );
    expect(resolveEdgeDepthState({ id: 'cd', source: 'c', target: 'd' }, focusState)).toBe(
      'background'
    );
    expect(
      resolveEdgeDepthState(
        { id: 'off', source: 'c', target: 'd' },
        { ...focusState, anchorNodeId: null }
      )
    ).toBe('active');
    expect(
      resolveEdgeDepthState(
        { id: 'off-mode', source: 'c', target: 'd' },
        { ...focusState, depthMode: 'off' }
      )
    ).toBe('active');
  });
});
