import { defineComponent, ref } from 'vue';

import { UiBadge, UiButton, UiDialog, UiDrawer, UiField, UiInput, UiSwitch } from '@ww/core';
import { createSignalGraphNodeDefinition, type SignalGraphSignalVariant } from '@ww/signal-graph';

const ServiceNode = defineComponent({
  name: 'StorySignalServiceNode',
  components: { UiBadge, UiButton },
  props: {
    data: { type: Object, required: true },
    depthState: { type: String, required: true },
    graph: { type: Object, required: true },
    hasRecentSignal: { type: Boolean, required: true },
    node: { type: Object, required: true },
  },
  template: `
    <div class="ui-stack" style="gap: var(--ui-space-3);">
      <div class="ui-cluster" style="justify-content: space-between; align-items: center;">
        <strong>{{ data.title }}</strong>
        <UiBadge :variant="hasRecentSignal ? 'success' : 'neutral'">
          {{ hasRecentSignal ? 'Signaled' : depthState }}
        </UiBadge>
      </div>
      <p style="margin: 0; color: var(--ui-text-secondary); font-size: var(--ui-font-size-sm);">
        {{ data.subtitle }}
      </p>
      <div class="ui-cluster">
        <UiBadge variant="brand">{{ data.health }}</UiBadge>
        <UiBadge>{{ data.latency }}</UiBadge>
      </div>
      <UiButton variant="secondary" size="sm" class="nodrag" @click="graph.focusNode(node.id)">
        Focus
      </UiButton>
    </div>
  `,
});

const ControlNode = defineComponent({
  name: 'StorySignalControlNode',
  components: { UiField, UiInput, UiSwitch },
  props: {
    data: { type: Object, required: true },
  },
  template: `
    <div class="ui-stack" style="gap: var(--ui-space-3);">
      <UiField label="Channel">
        <UiInput :model-value="String(data.channel)" readonly />
      </UiField>
      <label class="ui-cluster" style="justify-content: space-between;">
        <span style="font-size: var(--ui-font-size-sm); color: var(--ui-text-secondary);">Throttle guard</span>
        <UiSwitch :model-value="Boolean(data.enabled)" disabled />
      </label>
    </div>
  `,
});

const OverlayNode = defineComponent({
  name: 'StorySignalOverlayNode',
  components: { UiButton, UiDialog, UiDrawer },
  setup() {
    const dialogOpen = ref(false);
    const drawerOpen = ref(false);
    return {
      dialogOpen,
      drawerOpen,
    };
  },
  template: `
    <div class="ui-stack" style="gap: var(--ui-space-3);">
      <UiButton size="sm" class="nodrag" @click="dialogOpen = true">Open dialog</UiButton>
      <UiButton size="sm" variant="secondary" class="nodrag" @click="drawerOpen = true">
        Open drawer
      </UiButton>
      <UiDialog v-model:open="dialogOpen" title="Node dialog">
        Overlay content inherits the graph theme scope.
      </UiDialog>
      <UiDrawer v-model:open="drawerOpen" title="Node drawer">
        Drawer content opened from graph node.
      </UiDrawer>
    </div>
  `,
});

export const signalGraphNodeDefinitions = {
  service: createSignalGraphNodeDefinition({
    component: ServiceNode,
    label: 'Service',
    minWidth: 248,
    minHeight: 176,
    glass: true,
  }),
  control: createSignalGraphNodeDefinition({
    component: ControlNode,
    label: 'Control',
    minWidth: 264,
    minHeight: 172,
  }),
  overlay: createSignalGraphNodeDefinition({
    component: OverlayNode,
    label: 'Overlay',
    minWidth: 232,
    minHeight: 172,
    glass: true,
  }),
};

export const overviewNodes = [
  {
    id: 'gateway',
    type: 'service',
    position: { x: 32, y: 72 },
    label: 'Gateway',
    data: { title: 'Gateway', subtitle: 'Ingress and routing', health: 'healthy', latency: '23ms' },
  },
  {
    id: 'pipeline',
    type: 'control',
    position: { x: 360, y: 44 },
    label: 'Pipeline',
    data: { channel: 'priority-sync', enabled: true },
  },
  {
    id: 'worker',
    type: 'service',
    position: { x: 360, y: 236 },
    label: 'Worker',
    data: { title: 'Worker', subtitle: 'Processing queue', health: 'stable', latency: '41ms' },
  },
  {
    id: 'overlay',
    type: 'overlay',
    position: { x: 706, y: 128 },
    label: 'Inspector',
    data: {},
  },
];

export const overviewEdges = [
  { id: 'gateway-pipeline', source: 'gateway', target: 'pipeline', label: 'route' },
  { id: 'gateway-worker', source: 'gateway', target: 'worker', label: 'fanout' },
  { id: 'pipeline-overlay', source: 'pipeline', target: 'overlay', label: 'inspect' },
  { id: 'worker-overlay', source: 'worker', target: 'overlay', label: 'report' },
];

export const pipelineNodes = [
  {
    id: 'source',
    type: 'service',
    position: { x: 24, y: 120 },
    label: 'Source',
    data: { title: 'Source', subtitle: 'Capture', health: 'ready', latency: '12ms' },
  },
  {
    id: 'enrich',
    type: 'control',
    position: { x: 310, y: 40 },
    label: 'Enrich',
    data: { channel: 'normalize', enabled: true },
  },
  {
    id: 'score',
    type: 'service',
    position: { x: 310, y: 224 },
    label: 'Score',
    data: { title: 'Score', subtitle: 'Risk model', health: 'watch', latency: '57ms' },
  },
  {
    id: 'sink',
    type: 'service',
    position: { x: 620, y: 120 },
    label: 'Sink',
    data: { title: 'Sink', subtitle: 'Dispatch', health: 'healthy', latency: '18ms' },
  },
];

export const pipelineEdges = [
  { id: 'source-enrich', source: 'source', target: 'enrich', label: 'hydrate' },
  { id: 'source-score', source: 'source', target: 'score', label: 'branch' },
  { id: 'enrich-sink', source: 'enrich', target: 'sink', label: 'commit' },
  { id: 'score-sink', source: 'score', target: 'sink', label: 'approve' },
];

export const analysisNodes = [
  {
    id: 'focus',
    type: 'service',
    position: { x: 220, y: 160 },
    label: 'Focus',
    data: { title: 'Focus', subtitle: 'Primary subject', health: 'active', latency: 'live' },
  },
  {
    id: 'left',
    type: 'service',
    position: { x: 16, y: 32 },
    label: 'Related A',
    data: { title: 'Related A', subtitle: 'Context edge', health: 'related', latency: '38ms' },
  },
  {
    id: 'right',
    type: 'service',
    position: { x: 448, y: 32 },
    label: 'Related B',
    data: { title: 'Related B', subtitle: 'Context edge', health: 'related', latency: '34ms' },
  },
  {
    id: 'bg',
    type: 'service',
    position: { x: 220, y: 328 },
    label: 'Background',
    data: { title: 'Background', subtitle: 'Secondary surface', health: 'quiet', latency: '76ms' },
  },
];

export const analysisEdges = [
  { id: 'left-focus', source: 'left', target: 'focus', label: 'neighbor' },
  { id: 'focus-right', source: 'focus', target: 'right', label: 'neighbor' },
  { id: 'focus-bg', source: 'focus', target: 'bg', label: 'deeper link' },
];

export function createSignal(
  edgeId: string,
  variant: SignalGraphSignalVariant,
  suffix: string,
  delay = 0
) {
  return {
    id: `${edgeId}-${variant}-${suffix}`,
    edgeId,
    variant,
    direction: 'forward' as const,
    intensity: 'md' as const,
    startedAt: Date.now() + delay,
  };
}
