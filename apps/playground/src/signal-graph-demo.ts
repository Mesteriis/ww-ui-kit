import { defineComponent, h, ref, type PropType } from 'vue';

import { UiBadge, UiButton, UiDialog, UiDrawer, UiField, UiInput, UiSwitch } from '@ww/core';
import {
  createSignalGraphNodeDefinition,
  type SignalGraphDepthState,
  type SignalGraphNode,
  type SignalGraphNodeRendererProps,
} from '@ww/signal-graph';

type RuntimeNodeData = {
  title: string;
  subtitle: string;
  status: string;
  metric: string;
};

type ControlsNodeData = {
  channel: string;
  enabled: boolean;
};

type OverlayNodeData = Record<string, never>;

const stackStyle = { gap: 'var(--ui-space-3)' } as const;
const clusterSpaceBetweenStyle = {
  justifyContent: 'space-between',
  alignItems: 'center',
} as const;
const mutedCopyStyle = {
  margin: '0',
  color: 'var(--ui-text-secondary)',
  fontSize: 'var(--ui-font-size-sm)',
} as const;

const RuntimeNode = defineComponent({
  name: 'PlaygroundRuntimeNode',
  props: {
    data: { type: Object as PropType<RuntimeNodeData>, required: true },
    depthState: { type: String as PropType<SignalGraphDepthState>, required: true },
    graph: {
      type: Object as PropType<SignalGraphNodeRendererProps<RuntimeNodeData>['graph']>,
      required: true,
    },
    hasRecentSignal: { type: Boolean, required: true },
    node: { type: Object as PropType<SignalGraphNode<RuntimeNodeData>>, required: true },
  },
  setup(props) {
    return () =>
      h('div', { class: 'ui-stack', style: stackStyle }, [
        h('div', { class: 'ui-cluster', style: clusterSpaceBetweenStyle }, [
          h('strong', props.data.title),
          h(
            UiBadge,
            { variant: props.hasRecentSignal ? 'success' : 'brand' },
            () => props.depthState
          ),
        ]),
        h('p', { style: mutedCopyStyle }, props.data.subtitle),
        h('div', { class: 'ui-cluster' }, [
          h(UiBadge, null, () => props.data.status),
          h(UiBadge, { variant: 'brand' }, () => props.data.metric),
        ]),
        h(
          UiButton,
          {
            size: 'sm',
            variant: 'secondary',
            class: 'nodrag',
            onClick: () => props.graph.focusNode(props.node.id),
          },
          () => 'Focus node'
        ),
      ]);
  },
});

const ControlsNode = defineComponent({
  name: 'PlaygroundControlsNode',
  props: {
    data: { type: Object as PropType<ControlsNodeData>, required: true },
  },
  setup(props) {
    return () =>
      h('div', { class: 'ui-stack', style: stackStyle }, [
        h(
          UiField,
          { label: 'Channel' },
          {
            default: ({ inputId }: { inputId: string }) =>
              h(UiInput, { id: inputId, modelValue: String(props.data.channel), readonly: true }),
          }
        ),
        h('label', { class: 'ui-cluster', style: clusterSpaceBetweenStyle }, [
          h('span', { style: mutedCopyStyle }, 'Auto-retry'),
          h(UiSwitch, { modelValue: Boolean(props.data.enabled), disabled: true }),
        ]),
      ]);
  },
});

const OverlayNode = defineComponent({
  name: 'PlaygroundOverlayNode',
  props: {
    data: { type: Object as PropType<OverlayNodeData>, required: true },
  },
  setup() {
    const dialogOpen = ref(false);
    const drawerOpen = ref(false);

    return () =>
      h('div', { class: 'ui-stack', style: stackStyle }, [
        h(
          UiButton,
          {
            size: 'sm',
            class: 'nodrag',
            onClick: () => {
              dialogOpen.value = true;
            },
          },
          () => 'Node dialog'
        ),
        h(
          UiButton,
          {
            size: 'sm',
            variant: 'secondary',
            class: 'nodrag',
            onClick: () => {
              drawerOpen.value = true;
            },
          },
          () => 'Node drawer'
        ),
        h(
          UiDialog,
          {
            open: dialogOpen.value,
            title: 'Graph node dialog',
            'onUpdate:open': (value: boolean) => {
              dialogOpen.value = value;
            },
          },
          () => 'Overlay opened from inside graph node content.'
        ),
        h(
          UiDrawer,
          {
            open: drawerOpen.value,
            title: 'Graph node drawer',
            'onUpdate:open': (value: boolean) => {
              drawerOpen.value = value;
            },
          },
          () => 'Drawer opened from node content stays inside current theme scope.'
        ),
      ]);
  },
});

export const signalGraphNodeDefinitions = {
  runtime: createSignalGraphNodeDefinition({
    component: RuntimeNode,
    label: 'Runtime',
    minWidth: 248,
    minHeight: 176,
    glass: true,
  }),
  controls: createSignalGraphNodeDefinition({
    component: ControlsNode,
    label: 'Controls',
    minWidth: 264,
    minHeight: 172,
  }),
  overlay: createSignalGraphNodeDefinition({
    component: OverlayNode,
    label: 'Overlay',
    minWidth: 236,
    minHeight: 176,
    glass: true,
  }),
};

export const signalGraphOverviewNodes = [
  {
    id: 'ingress',
    type: 'runtime',
    position: { x: 28, y: 72 },
    label: 'Ingress',
    data: { title: 'Ingress', subtitle: 'Gateway surface', status: 'stable', metric: '21ms' },
  },
  {
    id: 'router',
    type: 'controls',
    position: { x: 350, y: 34 },
    label: 'Router',
    data: { channel: 'priority-route', enabled: true },
  },
  {
    id: 'worker',
    type: 'runtime',
    position: { x: 350, y: 244 },
    label: 'Worker',
    data: { title: 'Worker', subtitle: 'Decision pass', status: 'watch', metric: '43ms' },
  },
  {
    id: 'overlay',
    type: 'overlay',
    position: { x: 706, y: 140 },
    label: 'Inspector',
    data: {},
  },
];

export const signalGraphOverviewEdges = [
  { id: 'ingress-router', source: 'ingress', target: 'router', label: 'route' },
  { id: 'ingress-worker', source: 'ingress', target: 'worker', label: 'fanout' },
  { id: 'router-overlay', source: 'router', target: 'overlay', label: 'inspect' },
  { id: 'worker-overlay', source: 'worker', target: 'overlay', label: 'report' },
];

export const signalGraphFocusNodes = [
  {
    id: 'focus',
    type: 'runtime',
    position: { x: 232, y: 156 },
    label: 'Focus',
    data: { title: 'Focus', subtitle: 'Primary anchor', status: 'active', metric: 'live' },
  },
  {
    id: 'left',
    type: 'runtime',
    position: { x: 24, y: 34 },
    label: 'Left',
    data: { title: 'Left', subtitle: 'Related A', status: 'related', metric: '31ms' },
  },
  {
    id: 'right',
    type: 'runtime',
    position: { x: 458, y: 34 },
    label: 'Right',
    data: { title: 'Right', subtitle: 'Related B', status: 'related', metric: '33ms' },
  },
  {
    id: 'background',
    type: 'runtime',
    position: { x: 232, y: 320 },
    label: 'Background',
    data: { title: 'Background', subtitle: 'Secondary', status: 'quiet', metric: '64ms' },
  },
];

export const signalGraphFocusEdges = [
  { id: 'left-focus', source: 'left', target: 'focus', label: 'left' },
  { id: 'focus-right', source: 'focus', target: 'right', label: 'right' },
  { id: 'focus-background', source: 'focus', target: 'background', label: 'deep' },
];

export function createSignal(
  edgeId: string,
  variant: 'info' | 'success' | 'warning' | 'danger' | 'accent',
  suffix: string
) {
  return {
    id: `${edgeId}-${variant}-${suffix}`,
    edgeId,
    variant,
    direction: 'forward' as const,
    intensity: 'md' as const,
  };
}
