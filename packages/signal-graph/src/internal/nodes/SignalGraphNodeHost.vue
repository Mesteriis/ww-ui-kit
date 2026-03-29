<script setup lang="ts">
import { computed, inject } from 'vue';
import { Handle, Position, type NodeProps } from '@vue-flow/core';

import { signalGraphRuntimeKey, resolveNodeDepthState } from '../context';
import SignalGraphNodeShell from './SignalGraphNodeShell.vue';
import type { SignalGraphVendorNodeData } from '../adapters/map-signal-nodes';

defineOptions({ name: 'SignalGraphNodeHost' });

const props = defineProps<NodeProps<SignalGraphVendorNodeData>>();
const runtime = inject(signalGraphRuntimeKey, null);

const node = computed(() => runtime?.nodeMap.value.get(props.id) ?? null);
const definition = computed(() =>
  node.value ? runtime?.nodeDefinitions.value[node.value.type] : undefined
);
const depthState = computed(() =>
  node.value && runtime ? resolveNodeDepthState(node.value.id, runtime.focusState.value) : 'active'
);
const hasRecentSignal = computed(() => runtime?.reactingNodeIds.value.has(props.id) ?? false);
const isActive = computed(() => depthState.value === 'active');
const isRelated = computed(() => depthState.value === 'related');
const graphApi = computed(() => ({
  ...runtime?.graphApi,
  interactionMode: runtime?.interactionMode.value ?? 'interactive',
  reducedMotion: runtime?.reducedMotion.value ?? false,
  theme: runtime?.themeState.value ?? {
    container: null,
    revision: 0,
    themeName: 'light',
    themeType: 'light',
  },
}));
</script>

<template>
  <div class="ui-signal-graph__node-host" :data-ui-depth="depthState">
    <Handle
      type="target"
      :position="Position.Left"
      class="ui-signal-graph__handle ui-signal-graph__handle--target"
      :connectable="false"
    />

    <SignalGraphNodeShell
      :label="node?.label ?? definition?.label ?? props.id"
      :glass="definition?.glass"
      :depth-state="depthState"
      :has-recent-signal="hasRecentSignal"
      :is-active="isActive"
      :is-related="isRelated"
    >
      <component
        :is="definition?.component"
        v-if="node && definition"
        :node="node"
        :data="node.data"
        :definition="definition"
        :depth-state="depthState"
        :is-active="isActive"
        :is-related="isRelated"
        :has-recent-signal="hasRecentSignal"
        :graph="graphApi"
      />
      <div v-else class="ui-signal-graph__node-missing">
        Missing node renderer for <strong>{{ props.type }}</strong>
      </div>
    </SignalGraphNodeShell>

    <Handle
      type="source"
      :position="Position.Right"
      class="ui-signal-graph__handle ui-signal-graph__handle--source"
      :connectable="false"
    />
  </div>
</template>
