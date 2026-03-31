<script setup lang="ts">
import { computed, onMounted, provide, ref, toRef } from 'vue';
import { VueFlow, useVueFlow, type EdgeMouseEvent, type NodeMouseEvent } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';

import { useId } from '@ww/primitives';

import { signalGraphRuntimeKey } from '../internal/context';
import { useSignalGraphFocus } from '../composables/useSignalGraphFocus';
import { useSignalGraphModel } from '../composables/useSignalGraphModel';
import { useSignalGraphReducedMotion } from '../composables/useSignalGraphReducedMotion';
import { useSignalGraphSignals } from '../composables/useSignalGraphSignals';
import { useSignalGraphTheme } from '../composables/useSignalGraphTheme';
import { useSignalGraphViewport } from '../composables/useSignalGraphViewport';
import type {
  SignalGraphEdge,
  SignalGraphFocusState,
  SignalGraphHandle,
  SignalGraphNode,
  SignalGraphSignal,
  UiSignalGraphProps,
} from '../types';

defineOptions({ name: 'UiSignalGraph' });

const props = withDefaults(defineProps<UiSignalGraphProps>(), {
  interactionMode: 'interactive',
  depthMode: 'full',
  showBackground: true,
  showControls: true,
  showMiniMap: false,
  fitViewOnInit: true,
  fitViewPadding: 0.12,
  defaultZoom: 1,
  minZoom: 0.4,
  maxZoom: 1.8,
  loading: false,
  empty: false,
  emptyText: 'No graph nodes to display.',
  errorText: 'Unable to render graph.',
  ariaLabel: 'Interactive signal graph',
});

const emit = defineEmits<{
  (event: 'update:focusedNodeId', value: string | null): void;
  (event: 'nodeClick', value: SignalGraphNode): void;
  (event: 'nodeDoubleClick', value: SignalGraphNode): void;
  (event: 'edgeClick', value: SignalGraphEdge): void;
  (event: 'focusChange', value: SignalGraphFocusState): void;
  (event: 'signalComplete', value: SignalGraphSignal): void;
}>();

const hostRef = ref<HTMLElement | null>(null);
const clientReady = ref(false);
const graphId = useId('signal-graph');
const flowStore = useVueFlow(graphId.value);

const { themeState } = useSignalGraphTheme(hostRef);
const { reducedMotion } = useSignalGraphReducedMotion(computed(() => props.options?.motionMode));
const { nodeMap, edgeMap, flowNodes, flowEdges, nodeTypes, edgeTypes } = useSignalGraphModel({
  nodes: toRef(props, 'nodes'),
  edges: toRef(props, 'edges'),
  nodeDefinitions: toRef(props, 'nodeDefinitions'),
  interactionMode: computed(() => props.interactionMode),
});
const { anchorNodeId, clearFocus, focusNode, focusState, selectNode, setHoveredNodeId } =
  useSignalGraphFocus({
    nodes: toRef(props, 'nodes'),
    edges: toRef(props, 'edges'),
    depthMode: computed(() => props.depthMode),
    focusedNodeId: toRef(props, 'focusedNodeId'),
    relationDepth: computed(() => props.options?.relationDepth),
    onFocusChange: (value) => emit('update:focusedNodeId', value),
    onFocusStateChange: (value) => emit('focusChange', value),
  });
const { clearSignals, emitSignal, reactingNodeIds, runtimeSignalsByEdge } = useSignalGraphSignals({
  signals: toRef(props, 'signals'),
  edgeMap,
  reducedMotion,
  options: toRef(props, 'options'),
  onSignalComplete: (signal) => emit('signalComplete', signal),
});

const viewportHandle = useSignalGraphViewport({
  store: flowStore,
  fitViewPadding: props.fitViewPadding,
  defaultZoom: props.defaultZoom,
  focusNode,
  clearFocus,
  emitSignal,
});
const graphHandle: SignalGraphHandle = {
  ...viewportHandle,
  clearSignals,
};

const showError = computed(() => Boolean(props.error));
const showEmpty = computed(() => props.empty || props.nodes.length === 0);
const resolvedErrorText = computed(() => {
  if (typeof props.error === 'string') {
    return props.error;
  }

  if (props.error instanceof Error) {
    return props.error.message;
  }

  return props.errorText;
});
const backgroundVariant = computed(() => props.options?.backgroundVariant ?? 'dots');

provide(signalGraphRuntimeKey, {
  nodeMap,
  edgeMap,
  nodeDefinitions: computed(() => props.nodeDefinitions),
  focusState,
  depthMode: toRef(props, 'depthMode'),
  interactionMode: toRef(props, 'interactionMode'),
  runtimeSignalsByEdge,
  reactingNodeIds,
  reducedMotion,
  themeState,
  graphApi: {
    centerNode: graphHandle.centerNode,
    clearFocus: graphHandle.clearFocus,
    emitSignal: graphHandle.emitSignal,
    focusNode: graphHandle.focusNode,
  },
});

const handleNodeClick = ({ node }: NodeMouseEvent) => {
  const signalNode = nodeMap.value.get(node.id);
  if (!signalNode) {
    return;
  }

  selectNode(signalNode.id);
  emit('nodeClick', signalNode);
};

const handleNodeDoubleClick = ({ node }: NodeMouseEvent) => {
  const signalNode = nodeMap.value.get(node.id);
  if (!signalNode) {
    return;
  }

  focusNode(signalNode.id, 'selection');
  emit('nodeDoubleClick', signalNode);
};

const handleEdgeClick = ({ edge }: EdgeMouseEvent) => {
  const signalEdge = edgeMap.value.get(edge.id);
  if (signalEdge) {
    emit('edgeClick', signalEdge);
  }
};

const handleNodeHover = ({ node }: NodeMouseEvent) => {
  setHoveredNodeId(node.id);
};

const handleNodeLeave = () => {
  setHoveredNodeId(null);
};

defineExpose<SignalGraphHandle>(graphHandle);

onMounted(() => {
  clientReady.value = true;
});
</script>

<template>
  <section
    ref="hostRef"
    class="ui-signal-graph"
    :data-ui-motion-mode="reducedMotion ? 'reduced' : 'full'"
    :data-ui-depth-mode="props.depthMode"
    :data-ui-interaction-mode="props.interactionMode"
    :data-ui-focused-node-id="anchorNodeId ?? undefined"
    :aria-label="props.ariaLabel"
    :aria-busy="props.loading ? 'true' : undefined"
  >
    <div
      v-if="showError"
      class="ui-signal-graph__state ui-signal-graph__state--error"
      role="status"
      aria-live="polite"
    >
      <slot name="error" :message="resolvedErrorText">
        <strong class="ui-signal-graph__state-title">Graph error</strong>
        <p class="ui-signal-graph__state-text">{{ resolvedErrorText }}</p>
      </slot>
    </div>

    <div
      v-else-if="props.loading"
      class="ui-signal-graph__state ui-signal-graph__state--loading"
      role="status"
      aria-live="polite"
    >
      <slot name="loading">
        <div class="ui-signal-graph__loading-grid">
          <span />
          <span />
          <span />
        </div>
      </slot>
    </div>

    <div
      v-else-if="showEmpty"
      class="ui-signal-graph__state ui-signal-graph__state--empty"
      role="status"
      aria-live="polite"
    >
      <slot name="empty" :message="props.emptyText">
        <strong class="ui-signal-graph__state-title">Empty graph</strong>
        <p class="ui-signal-graph__state-text">{{ props.emptyText }}</p>
      </slot>
    </div>

    <div v-else class="ui-signal-graph__frame">
      <div v-if="!clientReady" class="ui-signal-graph__shell" role="presentation" />

      <VueFlow
        v-else
        :id="graphId"
        class="ui-signal-graph__canvas"
        :nodes="flowNodes"
        :edges="flowEdges"
        :node-types="nodeTypes"
        :edge-types="edgeTypes"
        :fit-view-on-init="props.fitViewOnInit"
        :default-viewport="{ zoom: props.defaultZoom }"
        :min-zoom="props.minZoom"
        :max-zoom="props.maxZoom"
        :nodes-draggable="props.interactionMode === 'interactive'"
        :elements-selectable="props.interactionMode === 'interactive'"
        :nodes-connectable="false"
        :pan-on-drag="true"
        :zoom-on-scroll="true"
        :prevent-scrolling="true"
        @node-click="handleNodeClick"
        @node-double-click="handleNodeDoubleClick"
        @node-mouse-enter="handleNodeHover"
        @node-mouse-leave="handleNodeLeave"
        @edge-click="handleEdgeClick"
      >
        <Background
          v-if="props.showBackground"
          class="ui-signal-graph__background"
          :variant="backgroundVariant"
          :gap="props.options?.backgroundGap ?? 28"
          :size="props.options?.backgroundSize ?? 1.25"
          :line-width="props.options?.backgroundLineWidth ?? 1"
        />
        <MiniMap
          v-if="props.showMiniMap"
          class="ui-signal-graph__minimap"
          :position="props.options?.miniMapPosition ?? 'bottom-left'"
          pannable
          zoomable
        />
        <Controls
          v-if="props.showControls"
          class="ui-signal-graph__controls"
          :position="props.options?.controlsPosition ?? 'bottom-right'"
        />
      </VueFlow>
    </div>
  </section>
</template>
