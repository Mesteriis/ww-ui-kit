import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { UiButton, UiDialog } from '@ww/core';

import UiSignalGraph from './UiSignalGraph.vue';
import { UiSignalGraph as ExportedUiSignalGraph } from '../index';
import { createSignalGraphNodeDefinition, type SignalGraphHandle } from '../types';

let lastVueFlowProps: Record<string, unknown> | null = null;

const flowStore = {
  fitView: vi.fn(() => Promise.resolve(true)),
  zoomIn: vi.fn(() => Promise.resolve(true)),
  zoomOut: vi.fn(() => Promise.resolve(true)),
  setViewport: vi.fn(() => Promise.resolve(true)),
  getViewport: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
  setCenter: vi.fn(() => Promise.resolve(true)),
  findNode: vi.fn((nodeId: string) => {
    const nodes =
      (lastVueFlowProps?.nodes as Array<{ id: string; width?: number; height?: number }>) ?? [];
    const node = nodes.find((entry) => entry.id === nodeId);

    if (!node) {
      return undefined;
    }

    return {
      id: node.id,
      computedPosition: { x: 100, y: 80, z: 0 },
      dimensions: { width: Number(node.width ?? 220), height: Number(node.height ?? 120) },
    };
  }),
};

vi.mock('@vue-flow/core', async () => {
  const vue = await import('vue');

  const MockVueFlow = vue.defineComponent({
    name: 'MockVueFlow',
    props: {
      id: { type: String, required: true },
      nodes: { type: Array, default: () => [] },
      edges: { type: Array, default: () => [] },
      nodeTypes: { type: Object, default: () => ({}) },
      edgeTypes: { type: Object, default: () => ({}) },
      fitViewOnInit: { type: Boolean, default: true },
      defaultViewport: { type: Object, default: () => ({}) },
      minZoom: { type: Number, default: 0.4 },
      maxZoom: { type: Number, default: 1.8 },
      nodesDraggable: { type: Boolean, default: true },
      elementsSelectable: { type: Boolean, default: true },
      nodesConnectable: { type: Boolean, default: false },
      panOnDrag: { type: [Boolean, Array], default: true },
      zoomOnScroll: { type: Boolean, default: true },
      preventScrolling: { type: Boolean, default: true },
    },
    emits: [
      'node-click',
      'node-double-click',
      'node-mouse-enter',
      'node-mouse-leave',
      'edge-click',
    ],
    setup(props, { emit, slots }) {
      return () => {
        lastVueFlowProps = {
          defaultViewport: props.defaultViewport,
          edges: props.edges,
          elementsSelectable: props.elementsSelectable,
          maxZoom: props.maxZoom,
          minZoom: props.minZoom,
          nodes: props.nodes,
          nodesDraggable: props.nodesDraggable,
        };

        return vue.h(
          'div',
          {
            'data-testid': 'mock-vue-flow',
            'data-elements-selectable': String(props.elementsSelectable),
            'data-nodes-draggable': String(props.nodesDraggable),
          },
          [
            ...(props.nodes as Array<Record<string, unknown>>).map((node) => {
              const NodeComponent = (props.nodeTypes as Record<string, unknown>)[String(node.type)];

              return vue.h(
                'div',
                {
                  key: String(node.id),
                  'data-node-id': String(node.id),
                  onClick: () => emit('node-click', { node }),
                  onDblclick: () => emit('node-double-click', { node }),
                  onMouseenter: () => emit('node-mouse-enter', { node }),
                  onMouseleave: () => emit('node-mouse-leave', { node }),
                },
                [
                  NodeComponent
                    ? vue.h(NodeComponent as never, {
                        connectable: false,
                        data: node.data,
                        dimensions: {
                          height: Number(node.height ?? 120),
                          width: Number(node.width ?? 220),
                        },
                        dragging: false,
                        events: {},
                        id: String(node.id),
                        label: node.label,
                        parentNodeId: node.parentNode,
                        position: node.position,
                        resizing: false,
                        selected: false,
                        sourcePosition: 'right',
                        targetPosition: 'left',
                        type: node.type,
                        zIndex: Number(node.zIndex ?? 0),
                      })
                    : null,
                ]
              );
            }),
            ...(props.edges as Array<Record<string, unknown>>).map((edge) => {
              const EdgeComponent = (props.edgeTypes as Record<string, unknown>)[String(edge.type)];

              return vue.h('svg', { key: String(edge.id), 'data-edge-id': String(edge.id) }, [
                EdgeComponent
                  ? vue.h(EdgeComponent as never, {
                      data: edge.data,
                      events: {},
                      id: String(edge.id),
                      interactionWidth: 24,
                      label: edge.label,
                      markerEnd: '',
                      markerStart: '',
                      selected: false,
                      source: edge.source,
                      sourceHandleId: undefined,
                      sourceNode: { id: edge.source },
                      sourcePosition: 'right',
                      sourceX: 0,
                      sourceY: 0,
                      style: {},
                      target: edge.target,
                      targetHandleId: undefined,
                      targetNode: { id: edge.target },
                      targetPosition: 'left',
                      targetX: 160,
                      targetY: 0,
                      type: edge.type,
                    })
                  : null,
              ]);
            }),
            slots.default?.(),
          ]
        );
      };
    },
  });

  const MockHandle = vue.defineComponent({
    name: 'MockSignalHandle',
    props: {
      connectable: { type: Boolean, default: false },
      position: { type: String, default: 'left' },
      type: { type: String, default: 'source' },
    },
    render() {
      return h('span', { 'data-testid': 'mock-handle', 'data-handle-type': this.type });
    },
  });

  return {
    EdgeMouseEvent: class {},
    Handle: MockHandle,
    MarkerType: { ArrowClosed: 'arrowclosed' },
    NodeMouseEvent: class {},
    Position: { Left: 'left', Right: 'right' },
    VueFlow: MockVueFlow,
    getBezierPath: () => ['M0,0 C40,0 120,0 160,0', 80, 0],
    useVueFlow: () => flowStore,
  };
});

vi.mock('@vue-flow/background', async () => {
  const vue = await import('vue');

  return {
    Background: vue.defineComponent({
      name: 'MockGraphBackground',
      render() {
        return h('div', { 'data-testid': 'mock-background' });
      },
    }),
  };
});

vi.mock('@vue-flow/controls', async () => {
  const vue = await import('vue');

  return {
    Controls: vue.defineComponent({
      name: 'MockGraphControls',
      render() {
        return h('div', { 'data-testid': 'mock-controls' });
      },
    }),
  };
});

vi.mock('@vue-flow/minimap', async () => {
  const vue = await import('vue');

  return {
    MiniMap: vue.defineComponent({
      name: 'MockGraphMiniMap',
      render() {
        return h('div', { 'data-testid': 'mock-minimap' });
      },
    }),
  };
});

const OverviewNode = defineComponent({
  name: 'OverviewNode',
  props: {
    data: { type: Object, required: true },
    depthState: { type: String, required: true },
    graph: { type: Object, required: true },
    hasRecentSignal: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    isRelated: { type: Boolean, required: true },
    node: { type: Object, required: true },
  },
  render() {
    return h('div', { class: 'overview-node' }, [
      h(
        'span',
        { 'data-testid': `depth-${String((this.node as { id: string }).id)}` },
        this.depthState
      ),
      h(
        'button',
        {
          class: 'nodrag',
          type: 'button',
          onClick: () =>
            (this.graph as { focusNode: (nodeId: string) => void }).focusNode(
              String((this.node as { id: string }).id)
            ),
        },
        'Focus'
      ),
    ]);
  },
});

const OverlayNode = defineComponent({
  name: 'OverlayNode',
  components: { UiButton, UiDialog },
  props: {
    node: { type: Object, required: true },
  },
  setup() {
    const open = ref(false);
    return { open };
  },
  template: `
    <div class="nodrag">
      <UiButton id="node-dialog-open" @click="open = true">Open overlay</UiButton>
      <UiDialog v-model:open="open" title="Node dialog">
        Overlay inside graph node
      </UiDialog>
    </div>
  `,
});

const nodeDefinitions = {
  overview: createSignalGraphNodeDefinition({
    component: OverviewNode,
    label: 'Overview',
    glass: true,
  }),
  overlay: createSignalGraphNodeDefinition({
    component: OverlayNode,
    label: 'Overlay',
  }),
};

const baseNodes = [
  { id: 'a', type: 'overview', position: { x: 0, y: 0 }, data: { title: 'A' }, label: 'Source' },
  { id: 'b', type: 'overview', position: { x: 260, y: 40 }, data: { title: 'B' }, label: 'Target' },
];

const baseEdges = [{ id: 'edge-a-b', source: 'a', target: 'b', label: 'signal' }];

describe('UiSignalGraph', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ui-theme');
    document.documentElement.removeAttribute('data-ui-theme-type');
    lastVueFlowProps = null;
    flowStore.fitView.mockClear();
    flowStore.zoomIn.mockClear();
    flowStore.zoomOut.mockClear();
    flowStore.setViewport.mockClear();
    flowStore.setCenter.mockClear();
    flowStore.findNode.mockClear();
  });

  it('exports the public component and renders the black-box graph surface', async () => {
    expect(ExportedUiSignalGraph).toBe(UiSignalGraph);

    const wrapper = mount(UiSignalGraph, {
      attachTo: document.body,
      props: {
        defaultZoom: 1.4,
        motionMode: 'full',
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
        showBackground: true,
        showControls: true,
        showMiniMap: true,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await nextTick();

    expect(wrapper.get('[data-testid="mock-vue-flow"]').attributes('data-nodes-draggable')).toBe(
      'true'
    );
    expect(wrapper.find('[data-testid="mock-background"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="mock-controls"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="mock-minimap"]').exists()).toBe(true);
    expect((lastVueFlowProps?.defaultViewport as { zoom?: number })?.zoom).toBe(1.4);
    expect(wrapper.attributes('data-ui-motion-mode')).toBe('full');
  });

  it('switches the surface to reduced motion mode when requested through options', async () => {
    const wrapper = mount(UiSignalGraph, {
      props: {
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
        options: {
          motionMode: 'reduced',
        },
      },
    });

    await nextTick();

    expect(wrapper.attributes('data-ui-motion-mode')).toBe('reduced');
    expect((lastVueFlowProps?.defaultViewport as { zoom?: number })?.zoom).toBe(1);
  });

  it('handles loading, empty, error, readonly mode, focus, signals, and imperative handle methods', async () => {
    const signalCompleted: string[] = [];
    vi.useFakeTimers();

    const wrapper = mount(UiSignalGraph, {
      attachTo: document.body,
      props: {
        interactionMode: 'readonly',
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
        onSignalComplete: (signal: { id: string }) => signalCompleted.push(signal.id),
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });
    await nextTick();

    expect(wrapper.get('[data-testid="mock-vue-flow"]').attributes('data-nodes-draggable')).toBe(
      'false'
    );

    await wrapper.get('[data-node-id="a"]').trigger('click');
    await nextTick();
    expect(wrapper.find('[data-ui-focused-node-id="a"]').exists()).toBe(true);
    expect(wrapper.emitted('update:focusedNodeId')?.[0]).toEqual(['a']);

    const graphApi = wrapper.vm as unknown as SignalGraphHandle;

    graphApi.emitSignal({
      id: 'runtime-signal',
      edgeId: 'edge-a-b',
      variant: 'success',
      direction: 'forward',
      intensity: 'md',
    });
    await nextTick();

    expect(wrapper.findAll('.ui-signal-graph__pulse')).toHaveLength(1);

    vi.advanceTimersByTime(1400);
    await nextTick();
    vi.useRealTimers();

    expect(signalCompleted).toContain('runtime-signal');

    graphApi.focusNode('b');
    await nextTick();
    expect(wrapper.find('[data-ui-focused-node-id="b"]').exists()).toBe(true);

    await graphApi.centerNode('b');
    expect(flowStore.setCenter).toHaveBeenCalled();

    await graphApi.resetViewport();
    expect(flowStore.setViewport).toHaveBeenCalled();

    wrapper.unmount();

    const loadingWrapper = mount(UiSignalGraph, {
      props: {
        loading: true,
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
      },
    });
    expect(loadingWrapper.find('.ui-signal-graph__state--loading').exists()).toBe(true);
    loadingWrapper.unmount();

    const emptyWrapper = mount(UiSignalGraph, {
      props: {
        nodes: [],
        edges: [],
        nodeDefinitions,
        emptyText: 'No graph here yet',
      },
    });
    expect(emptyWrapper.text()).toContain('No graph here yet');
    emptyWrapper.unmount();

    const errorWrapper = mount(UiSignalGraph, {
      props: {
        error: 'Graph crashed',
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
      },
    });
    expect(errorWrapper.text()).toContain('Graph crashed');
    errorWrapper.unmount();
  });

  it('keeps themed overlays opened from node content inside the scoped subtree', async () => {
    const wrapper = mount(
      defineComponent({
        components: { UiSignalGraph },
        setup() {
          return {
            edges: [],
            nodeDefinitions,
            nodes: [{ id: 'overlay', type: 'overlay', position: { x: 0, y: 0 }, data: {} }],
          };
        },
        template: `
          <section id="scope" data-ui-theme="belovodye" data-ui-theme-type="dark">
            <UiSignalGraph :nodes="nodes" :edges="edges" :node-definitions="nodeDefinitions" />
          </section>
        `,
      }),
      {
        attachTo: document.body,
        global: {
          stubs: {
            transition: false,
          },
        },
      }
    );

    await nextTick();
    await wrapper.get('#node-dialog-open').trigger('click');
    await nextTick();

    const scope = wrapper.get('#scope').element as HTMLElement;
    const portalRoot = scope.querySelector('[data-ui-portal-root="true"]');
    expect(portalRoot?.contains(document.querySelector('.ui-dialog'))).toBe(true);
    expect(portalRoot?.closest('[data-ui-theme]')).toBe(scope);
    expect(portalRoot?.closest('[data-ui-theme-type]')).toBe(scope);
  });

  it('covers custom state slots, missing vendor events, hover focus, and hidden graph chrome branches', async () => {
    const loadingWrapper = mount(UiSignalGraph, {
      props: {
        loading: true,
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
      },
      slots: {
        loading: '<div class="custom-loading">Loading graph shell</div>',
      },
    });

    expect(loadingWrapper.find('.custom-loading').exists()).toBe(true);
    loadingWrapper.unmount();

    const emptyWrapper = mount(UiSignalGraph, {
      props: {
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
        empty: true,
      },
      slots: {
        empty: '<div class="custom-empty">Empty graph shell</div>',
      },
    });
    expect(emptyWrapper.find('.custom-empty').exists()).toBe(true);
    emptyWrapper.unmount();

    const errorWrapper = mount(UiSignalGraph, {
      props: {
        error: new Error('Graph exploded'),
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
      },
      slots: {
        error: '<div class="custom-error">Error graph shell</div>',
      },
    });
    expect(errorWrapper.find('.custom-error').exists()).toBe(true);
    errorWrapper.unmount();

    const wrapper = mount(UiSignalGraph, {
      attachTo: document.body,
      props: {
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
        defaultZoom: undefined,
        showBackground: false,
        showControls: false,
        showMiniMap: false,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await nextTick();

    expect((lastVueFlowProps?.defaultViewport as { zoom?: number })?.zoom).toBe(1);
    expect(wrapper.find('[data-testid="mock-background"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="mock-controls"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="mock-minimap"]').exists()).toBe(false);

    const vueFlow = wrapper.getComponent({ name: 'MockVueFlow' });
    vueFlow.vm.$emit('node-click', { node: { id: 'missing' } });
    vueFlow.vm.$emit('node-double-click', { node: { id: 'missing' } });
    vueFlow.vm.$emit('edge-click', { edge: { id: 'missing' } });
    vueFlow.vm.$emit('node-mouse-enter', { node: { id: 'b' } });
    await nextTick();

    expect(wrapper.attributes('data-ui-focused-node-id')).toBe('b');

    vueFlow.vm.$emit('node-mouse-leave');
    await nextTick();
    expect(wrapper.attributes('data-ui-focused-node-id')).toBeUndefined();
    expect(wrapper.emitted('nodeClick')).toBeUndefined();
    expect(wrapper.emitted('nodeDoubleClick')).toBeUndefined();
    expect(wrapper.emitted('edgeClick')).toBeUndefined();
  });

  it('emits actual edge and double-click events and uses the default error text for boolean errors', async () => {
    const wrapper = mount(UiSignalGraph, {
      attachTo: document.body,
      props: {
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await nextTick();

    const vueFlow = wrapper.getComponent({ name: 'MockVueFlow' });
    vueFlow.vm.$emit('node-double-click', { node: { id: 'a' } });
    vueFlow.vm.$emit('edge-click', { edge: { id: 'edge-a-b' } });
    await nextTick();

    expect(wrapper.emitted('nodeDoubleClick')?.[0]?.[0]).toMatchObject({ id: 'a' });
    expect(wrapper.emitted('edgeClick')?.[0]?.[0]).toMatchObject({ id: 'edge-a-b' });
    expect(wrapper.attributes('data-ui-focused-node-id')).toBe('a');

    wrapper.unmount();

    const errorWrapper = mount(UiSignalGraph, {
      props: {
        error: true,
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
      },
    });

    expect(errorWrapper.text()).toContain('Unable to render graph.');
    errorWrapper.unmount();
  });

  it('renders a safe shell during server rendering', async () => {
    const html = await renderToString(
      h(UiSignalGraph, {
        nodes: baseNodes,
        edges: baseEdges,
        nodeDefinitions,
      })
    );

    expect(html).toContain('ui-signal-graph');
    expect(html).not.toContain('mock-vue-flow');
  });
});
