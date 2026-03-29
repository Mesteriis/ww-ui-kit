<script setup lang="ts">
import { computed, inject } from 'vue';
import { getBezierPath, type EdgeProps } from '@vue-flow/core';

import { signalGraphRuntimeKey, resolveEdgeDepthState } from '../context';
import SignalGraphPulseLayer from './SignalGraphPulseLayer.vue';
import type { SignalGraphVendorEdgeData } from '../adapters/map-signal-edges';

defineOptions({ name: 'SignalGraphEdge' });

const props = defineProps<EdgeProps<SignalGraphVendorEdgeData>>();
const runtime = inject(signalGraphRuntimeKey, null);

const pathState = computed(() =>
  getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
  })
);
const edgePath = computed(() => pathState.value[0]);
const labelX = computed(() => pathState.value[1]);
const labelY = computed(() => pathState.value[2]);
const originalEdge = computed(() => runtime?.edgeMap.value.get(props.id) ?? null);
const depthState = computed(() =>
  originalEdge.value && runtime
    ? resolveEdgeDepthState(originalEdge.value, runtime.focusState.value)
    : 'active'
);
const runtimeSignals = computed(() => runtime?.runtimeSignalsByEdge.value.get(props.id) ?? []);
const activeVariant = computed(
  () => runtimeSignals.value[runtimeSignals.value.length - 1]?.variant ?? null
);
const isReducedMotion = computed(() => runtime?.reducedMotion.value === true);
</script>

<template>
  <g
    class="ui-signal-graph__edge-group"
    :data-ui-depth="depthState"
    :data-ui-signaled="runtimeSignals.length > 0 ? 'true' : undefined"
    :data-ui-variant="activeVariant ?? undefined"
  >
    <path
      class="ui-signal-graph__edge-hitbox"
      :d="edgePath"
      fill="none"
      :stroke-width="interactionWidth ?? 24"
    />
    <path
      class="ui-signal-graph__edge-glow"
      :d="edgePath"
      fill="none"
      :marker-start="markerStart"
      :marker-end="markerEnd"
    />
    <path
      class="ui-signal-graph__edge-path"
      :d="edgePath"
      fill="none"
      :marker-start="markerStart"
      :marker-end="markerEnd"
    />

    <SignalGraphPulseLayer
      v-for="signal in runtimeSignals"
      :key="signal.id"
      :path="edgePath"
      :signal="signal"
      :reduced-motion="isReducedMotion"
    />

    <text
      v-if="label"
      class="ui-signal-graph__edge-label"
      :x="labelX"
      :y="labelY - 10"
      text-anchor="middle"
    >
      {{ label }}
    </text>
  </g>
</template>
