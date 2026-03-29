import { computed, defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@vue-flow/core', async () => {
  const vue = await import('vue');

  return {
    Handle: vue.defineComponent({
      name: 'MockSignalHandle',
      props: {
        type: { type: String, default: 'source' }
      },
      render() {
        return h('span', { 'data-testid': `handle-${this.type}` });
      }
    }),
    Position: {
      Left: 'left',
      Right: 'right'
    }
  };
});

import SignalGraphNodeHost from './SignalGraphNodeHost.vue';
import { signalGraphRuntimeKey } from '../context';
import { createSignalGraphNodeDefinition } from '../../types';

const Renderer = defineComponent({
  name: 'SignalGraphNodeRenderer',
  props: {
    data: { type: Object, required: true },
    depthState: { type: String, required: true },
    graph: { type: Object, required: true },
    hasRecentSignal: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    isRelated: { type: Boolean, required: true },
    node: { type: Object, required: true }
  },
  render() {
    return h('div', { class: 'renderer-output' }, [
      h('span', { 'data-testid': 'renderer-node-id' }, String((this.node as { id: string }).id)),
      h('span', { 'data-testid': 'renderer-depth' }, String(this.depthState)),
      h('span', { 'data-testid': 'renderer-theme' }, String((this.graph as { theme: { themeName: string } }).theme.themeName)),
      h('span', { 'data-testid': 'renderer-signal' }, String(this.hasRecentSignal)),
      h('span', { 'data-testid': 'renderer-related' }, String(this.isRelated)),
      h('span', { 'data-testid': 'renderer-active' }, String(this.isActive)),
      h('span', { 'data-testid': 'renderer-data' }, String((this.data as { title: string }).title)),
    ]);
  }
});

describe('SignalGraphNodeHost', () => {
  it('renders the mapped node renderer with graph-level props', () => {
    const wrapper = mount(SignalGraphNodeHost, {
      props: {
        connectable: false,
        id: 'node-a',
        type: 'service',
        data: { signalNodeId: 'node-a' },
        dimensions: { width: 240, height: 120 },
        dragging: false,
        events: {},
        label: 'Service A',
        parentNodeId: undefined,
        position: { x: 0, y: 0 },
        resizing: false,
        selected: false,
        sourcePosition: 'right',
        targetPosition: 'left',
        zIndex: 0
      },
      global: {
        provide: {
          [signalGraphRuntimeKey as symbol]: {
            nodeMap: computed(() => new Map([
              ['node-a', { id: 'node-a', type: 'service', position: { x: 0, y: 0 }, data: { title: 'Node A' }, label: 'Service A' }]
            ])),
            edgeMap: computed(() => new Map()),
            nodeDefinitions: computed(() => ({
              service: createSignalGraphNodeDefinition({
                component: Renderer,
                label: 'Definition label',
                glass: true
              })
            })),
            focusState: computed(() => ({
              anchorNodeId: 'node-a',
              source: 'selection',
              depthMode: 'full',
              relationDepth: 1,
              activeNodeIds: ['node-a'],
              relatedNodeIds: ['node-b'],
              backgroundNodeIds: []
            })),
            depthMode: ref('full'),
            interactionMode: ref('readonly'),
            runtimeSignalsByEdge: computed(() => new Map()),
            reactingNodeIds: ref(new Set(['node-a'])),
            reducedMotion: ref(true),
            themeState: ref({
              container: null,
              revision: 1,
              themeName: 'belovodye',
              themeType: 'light'
            }),
            graphApi: {
              centerNode: vi.fn(),
              clearFocus: vi.fn(),
              emitSignal: vi.fn(),
              focusNode: vi.fn()
            }
          }
        }
      }
    });

    expect(wrapper.get('[data-testid="handle-target"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="handle-source"]').exists()).toBe(true);
    expect(wrapper.attributes('data-ui-depth')).toBe('active');
    expect(wrapper.get('[data-testid="renderer-node-id"]').text()).toBe('node-a');
    expect(wrapper.get('[data-testid="renderer-depth"]').text()).toBe('active');
    expect(wrapper.get('[data-testid="renderer-theme"]').text()).toBe('belovodye');
    expect(wrapper.get('[data-testid="renderer-signal"]').text()).toBe('true');
    expect(wrapper.get('[data-testid="renderer-active"]').text()).toBe('true');
    expect(wrapper.get('[data-testid="renderer-related"]').text()).toBe('false');
    expect(wrapper.get('[data-testid="renderer-data"]').text()).toBe('Node A');
  });

  it('falls back to the missing renderer state without runtime context', () => {
    const wrapper = mount(SignalGraphNodeHost, {
      props: {
        connectable: false,
        id: 'missing-node',
        type: 'missing',
        data: { signalNodeId: 'missing-node' },
        dimensions: { width: 200, height: 120 },
        dragging: false,
        events: {},
        label: undefined,
        parentNodeId: undefined,
        position: { x: 0, y: 0 },
        resizing: false,
        selected: false,
        sourcePosition: 'right',
        targetPosition: 'left',
        zIndex: 0
      }
    });

    expect(wrapper.attributes('data-ui-depth')).toBe('active');
    expect(wrapper.text()).toContain('Missing node renderer for');
    expect(wrapper.text()).toContain('missing');
  });

  it('falls back to definition labels and default graph metadata when runtime data is partial', () => {
    const wrapper = mount(SignalGraphNodeHost, {
      props: {
        connectable: false,
        id: 'node-b',
        type: 'service',
        data: { signalNodeId: 'node-b' },
        dimensions: { width: 200, height: 120 },
        dragging: false,
        events: {},
        label: undefined,
        parentNodeId: undefined,
        position: { x: 0, y: 0 },
        resizing: false,
        selected: false,
        sourcePosition: 'right',
        targetPosition: 'left',
        zIndex: 0
      },
      global: {
        provide: {
          [signalGraphRuntimeKey as symbol]: {
            nodeMap: computed(() => new Map([
              ['node-b', { id: 'node-b', type: 'service', position: { x: 0, y: 0 }, data: { title: 'Node B' } }]
            ])),
            edgeMap: computed(() => new Map()),
            nodeDefinitions: computed(() => ({
              service: createSignalGraphNodeDefinition({
                component: Renderer,
                label: 'Definition fallback'
              })
            })),
            focusState: computed(() => ({
              anchorNodeId: null,
              source: 'none',
              depthMode: 'off',
              relationDepth: 0,
              activeNodeIds: [],
              relatedNodeIds: [],
              backgroundNodeIds: []
            })),
            depthMode: ref('off'),
            interactionMode: ref('interactive'),
            runtimeSignalsByEdge: computed(() => new Map()),
            reactingNodeIds: ref(new Set()),
            reducedMotion: ref(false),
            themeState: ref({
              container: null,
              revision: 0,
              themeName: 'light',
              themeType: 'light'
            }),
            graphApi: {
              centerNode: vi.fn(),
              clearFocus: vi.fn(),
              emitSignal: vi.fn(),
              focusNode: vi.fn()
            }
          }
        }
      }
    });

    expect(wrapper.text()).toContain('Definition fallback');
    expect(wrapper.get('[data-testid="renderer-theme"]').text()).toBe('light');
    expect(wrapper.get('[data-testid="renderer-signal"]').text()).toBe('false');
  });

  it('fills graph API defaults when optional runtime metadata is missing', () => {
    const wrapper = mount(SignalGraphNodeHost, {
      props: {
        connectable: false,
        id: 'node-c',
        type: 'service',
        data: { signalNodeId: 'node-c' },
        dimensions: { width: 200, height: 120 },
        dragging: false,
        events: {},
        label: undefined,
        parentNodeId: undefined,
        position: { x: 0, y: 0 },
        resizing: false,
        selected: false,
        sourcePosition: 'right',
        targetPosition: 'left',
        zIndex: 0
      },
      global: {
        provide: {
          [signalGraphRuntimeKey as symbol]: {
            nodeMap: computed(() => new Map([
              ['node-c', { id: 'node-c', type: 'service', position: { x: 0, y: 0 }, data: { title: 'Node C' } }]
            ])),
            edgeMap: computed(() => new Map()),
            nodeDefinitions: computed(() => ({
              service: createSignalGraphNodeDefinition({
                component: Renderer,
                label: 'Definition fallback'
              })
            })),
            focusState: computed(() => ({
              anchorNodeId: null,
              source: 'none',
              depthMode: 'off',
              relationDepth: 0,
              activeNodeIds: [],
              relatedNodeIds: [],
              backgroundNodeIds: []
            })),
            depthMode: ref('off'),
            interactionMode: ref(undefined),
            runtimeSignalsByEdge: computed(() => new Map()),
            reactingNodeIds: ref(new Set()),
            reducedMotion: ref(undefined),
            themeState: ref(undefined),
            graphApi: undefined
          }
        }
      }
    });

    expect(wrapper.get('[data-testid="renderer-theme"]').text()).toBe('light');
    expect(wrapper.get('[data-testid="renderer-data"]').text()).toBe('Node C');
  });
});
