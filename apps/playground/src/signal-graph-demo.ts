import { defineComponent, ref } from 'vue';

import { UiBadge, UiButton, UiDialog, UiDrawer, UiField, UiInput, UiSwitch } from '@ww/core';
import { createSignalGraphNodeDefinition } from '@ww/signal-graph';

const RuntimeNode = defineComponent({
  name: 'PlaygroundRuntimeNode',
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
        <UiBadge :variant="hasRecentSignal ? 'success' : 'brand'">{{ depthState }}</UiBadge>
      </div>
      <p style="margin: 0; color: var(--ui-text-secondary); font-size: var(--ui-font-size-sm);">
        {{ data.subtitle }}
      </p>
      <div class="ui-cluster">
        <UiBadge>{{ data.status }}</UiBadge>
        <UiBadge variant="brand">{{ data.metric }}</UiBadge>
      </div>
      <UiButton size="sm" variant="secondary" class="nodrag" @click="graph.focusNode(node.id)">
        Focus node
      </UiButton>
    </div>
  `,
});

const ControlsNode = defineComponent({
  name: 'PlaygroundControlsNode',
  components: { UiField, UiInput, UiSwitch },
  props: {
    data: { type: Object, required: true },
  },
  template: `
    <div class="ui-stack" style="gap: var(--ui-space-3);">
      <UiField label="Channel">
        <UiInput :model-value="String(data.channel)" readonly />
      </UiField>
      <label class="ui-cluster" style="justify-content: space-between; align-items: center;">
        <span style="font-size: var(--ui-font-size-sm); color: var(--ui-text-secondary);">Auto-retry</span>
        <UiSwitch :model-value="Boolean(data.enabled)" disabled />
      </label>
    </div>
  `,
});

const OverlayNode = defineComponent({
  name: 'PlaygroundOverlayNode',
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
      <UiButton size="sm" class="nodrag" @click="dialogOpen = true">Node dialog</UiButton>
      <UiButton size="sm" variant="secondary" class="nodrag" @click="drawerOpen = true">
        Node drawer
      </UiButton>
      <UiDialog v-model:open="dialogOpen" title="Graph node dialog">
        Overlay opened from inside graph node content.
      </UiDialog>
      <UiDrawer v-model:open="drawerOpen" title="Graph node drawer">
        Drawer opened from node content stays inside current theme scope.
      </UiDrawer>
    </div>
  `,
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
