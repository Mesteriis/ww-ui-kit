import { computed, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@vue-flow/core', async () => {
  return {
    getBezierPath: vi.fn(() => ['M0,0 C40,0 120,0 160,0', 80, 0]),
  };
});

import SignalGraphEdge from './SignalGraphEdge.vue';
import { signalGraphRuntimeKey } from '../context';

describe('SignalGraphEdge', () => {
  it('renders edge depth, pulses, labels, and active variants from runtime context', () => {
    const wrapper = mount(SignalGraphEdge, {
      props: {
        id: 'edge-a-b',
        type: 'signal-graph-edge',
        data: { signalEdgeId: 'edge-a-b', direction: 'forward' },
        events: {},
        interactionWidth: 24,
        label: 'Edge label',
        markerEnd: 'url(#arrow-end)',
        markerStart: 'url(#arrow-start)',
        selected: false,
        source: 'a',
        sourceHandleId: undefined,
        sourceNode: { id: 'a' },
        sourcePosition: 'right',
        sourceX: 0,
        sourceY: 0,
        style: {},
        target: 'b',
        targetHandleId: undefined,
        targetNode: { id: 'b' },
        targetPosition: 'left',
        targetX: 160,
        targetY: 0,
      },
      global: {
        provide: {
          [signalGraphRuntimeKey as symbol]: {
            edgeMap: computed(
              () => new Map([['edge-a-b', { id: 'edge-a-b', source: 'a', target: 'b' }]])
            ),
            nodeMap: computed(() => new Map()),
            nodeDefinitions: computed(() => ({})),
            focusState: computed(() => ({
              anchorNodeId: 'a',
              source: 'selection',
              depthMode: 'full',
              relationDepth: 1,
              activeNodeIds: ['a'],
              relatedNodeIds: ['b'],
              backgroundNodeIds: [],
            })),
            depthMode: ref('full'),
            interactionMode: ref('interactive'),
            runtimeSignalsByEdge: computed(
              () =>
                new Map([
                  [
                    'edge-a-b',
                    [
                      {
                        id: 'signal-1',
                        edgeId: 'edge-a-b',
                        variant: 'success',
                        direction: 'forward',
                        intensity: 'md',
                        durationMs: 500,
                        startedAt: 1,
                        delayMs: 40,
                        targetNodeId: 'b',
                        signal: {
                          id: 'signal-1',
                          edgeId: 'edge-a-b',
                          variant: 'success',
                          direction: 'forward',
                          intensity: 'md',
                        },
                      },
                    ],
                  ],
                ])
            ),
            reactingNodeIds: ref(new Set()),
            reducedMotion: ref(true),
            themeState: ref({
              container: null,
              revision: 0,
              themeName: 'light',
              themeType: 'light',
            }),
            graphApi: {
              centerNode: vi.fn(),
              clearFocus: vi.fn(),
              emitSignal: vi.fn(),
              focusNode: vi.fn(),
            },
          },
        },
      },
    });

    expect(wrapper.attributes('data-ui-depth')).toBe('active');
    expect(wrapper.attributes('data-ui-signaled')).toBe('true');
    expect(wrapper.attributes('data-ui-variant')).toBe('success');
    expect(wrapper.find('.ui-signal-graph__pulse').classes()).toContain(
      'ui-signal-graph__pulse--reduced'
    );
    expect(wrapper.find('.ui-signal-graph__edge-label').text()).toBe('Edge label');
  });

  it('falls back to active depth without runtime context and omits optional labels', () => {
    const wrapper = mount(SignalGraphEdge, {
      props: {
        id: 'edge-missing',
        type: 'signal-graph-edge',
        data: { signalEdgeId: 'edge-missing', direction: 'forward' },
        events: {},
        interactionWidth: undefined,
        label: undefined,
        markerEnd: '',
        markerStart: '',
        selected: false,
        source: 'a',
        sourceHandleId: undefined,
        sourceNode: { id: 'a' },
        sourcePosition: 'right',
        sourceX: 0,
        sourceY: 0,
        style: {},
        target: 'b',
        targetHandleId: undefined,
        targetNode: { id: 'b' },
        targetPosition: 'left',
        targetX: 160,
        targetY: 0,
      },
    });

    expect(wrapper.attributes('data-ui-depth')).toBe('active');
    expect(wrapper.attributes('data-ui-signaled')).toBeUndefined();
    expect(wrapper.attributes('data-ui-variant')).toBeUndefined();
    expect(wrapper.find('.ui-signal-graph__edge-label').exists()).toBe(false);
  });

  it('renders active pulses without the reduced-motion class when runtime motion is enabled', () => {
    const wrapper = mount(SignalGraphEdge, {
      props: {
        id: 'edge-live',
        type: 'signal-graph-edge',
        data: { signalEdgeId: 'edge-live', direction: 'forward' },
        events: {},
        interactionWidth: 16,
        label: undefined,
        markerEnd: '',
        markerStart: '',
        selected: false,
        source: 'a',
        sourceHandleId: undefined,
        sourceNode: { id: 'a' },
        sourcePosition: 'right',
        sourceX: 0,
        sourceY: 0,
        style: {},
        target: 'b',
        targetHandleId: undefined,
        targetNode: { id: 'b' },
        targetPosition: 'left',
        targetX: 160,
        targetY: 0,
      },
      global: {
        provide: {
          [signalGraphRuntimeKey as symbol]: {
            edgeMap: computed(
              () => new Map([['edge-live', { id: 'edge-live', source: 'a', target: 'b' }]])
            ),
            nodeMap: computed(() => new Map()),
            nodeDefinitions: computed(() => ({})),
            focusState: computed(() => ({
              anchorNodeId: null,
              source: 'none',
              depthMode: 'off',
              relationDepth: 0,
              activeNodeIds: [],
              relatedNodeIds: [],
              backgroundNodeIds: [],
            })),
            depthMode: ref('off'),
            interactionMode: ref('interactive'),
            runtimeSignalsByEdge: computed(
              () =>
                new Map([
                  [
                    'edge-live',
                    [
                      {
                        id: 'signal-live',
                        edgeId: 'edge-live',
                        variant: 'accent',
                        direction: 'forward',
                        intensity: 'sm',
                        durationMs: 180,
                        startedAt: 1,
                        delayMs: 0,
                        targetNodeId: 'b',
                        signal: {
                          id: 'signal-live',
                          edgeId: 'edge-live',
                          variant: 'accent',
                          direction: 'forward',
                          intensity: 'sm',
                        },
                      },
                    ],
                  ],
                ])
            ),
            reactingNodeIds: ref(new Set()),
            reducedMotion: ref(false),
            themeState: ref({
              container: null,
              revision: 0,
              themeName: 'dark',
              themeType: 'dark',
            }),
            graphApi: {
              centerNode: vi.fn(),
              clearFocus: vi.fn(),
              emitSignal: vi.fn(),
              focusNode: vi.fn(),
            },
          },
        },
      },
    });

    expect(wrapper.find('.ui-signal-graph__pulse').classes()).not.toContain(
      'ui-signal-graph__pulse--reduced'
    );
  });
});
