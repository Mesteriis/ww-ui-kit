<script setup lang="ts">
import { ref } from 'vue';

import { UiBadge, UiButton, UiCard } from '@ww/core';
import { UiSignalGraph, type SignalGraphHandle } from '@ww/signal-graph';

import {
  createSignal,
  signalGraphFocusEdges,
  signalGraphFocusNodes,
  signalGraphNodeDefinitions,
  signalGraphOverviewEdges,
  signalGraphOverviewNodes,
} from './signal-graph-demo';

const graphRef = ref<SignalGraphHandle | null>(null);
const scopedGraphRef = ref<SignalGraphHandle | null>(null);
const queuedSignals = ref([
  createSignal('ingress-router', 'info', 'initial'),
  createSignal('worker-overlay', 'success', 'initial'),
]);

const emitSignalVariant = (variant: 'info' | 'success' | 'warning' | 'danger' | 'accent') => {
  graphRef.value?.emitSignal([
    createSignal('ingress-router', variant, `${variant}-1`),
    createSignal('ingress-router', variant, `${variant}-2`),
    createSignal('worker-overlay', variant, `${variant}-3`),
  ]);
};

const replayReducedSignal = () => {
  scopedGraphRef.value?.emitSignal([
    createSignal('ingress-router', 'accent', 'reduced-1'),
    createSignal('worker-overlay', 'warning', 'reduced-2'),
  ]);
};
</script>

<template>
  <section
    id="testing-signal-graph"
    class="playground__foundation-grid"
    data-playground-scenario="signal-graph"
  >
    <UiCard>
      <template #header>Signal graph overview</template>
      <div class="ui-stack">
        <div class="ui-cluster">
          <UiBadge variant="brand">Interactive graph UI</UiBadge>
          <UiBadge>Node = component</UiBadge>
          <UiBadge>Signals + depth + overlays</UiBadge>
        </div>
        <div class="ui-cluster">
          <UiButton size="sm" @click="emitSignalVariant('info')">Info</UiButton>
          <UiButton size="sm" @click="emitSignalVariant('success')">Success</UiButton>
          <UiButton size="sm" @click="emitSignalVariant('warning')">Warning</UiButton>
          <UiButton size="sm" @click="emitSignalVariant('danger')">Danger</UiButton>
          <UiButton size="sm" @click="emitSignalVariant('accent')">Accent</UiButton>
        </div>
        <UiSignalGraph
          ref="graphRef"
          aria-label="Playground signal graph overview"
          :nodes="signalGraphOverviewNodes"
          :edges="signalGraphOverviewEdges"
          :node-definitions="signalGraphNodeDefinitions"
          :signals="queuedSignals"
          show-background
          show-controls
          show-mini-map
        />
      </div>
    </UiCard>

    <UiCard>
      <template #header>Focus, depth, and reduced motion</template>
      <div
        style="
          display: grid;
          gap: var(--ui-space-6);
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
        "
      >
        <UiSignalGraph
          aria-label="Depth full graph"
          :nodes="signalGraphFocusNodes"
          :edges="signalGraphFocusEdges"
          :node-definitions="signalGraphNodeDefinitions"
          depth-mode="full"
          :focused-node-id="'focus'"
          show-background
        />
        <UiSignalGraph
          aria-label="Depth lite graph"
          :nodes="signalGraphFocusNodes"
          :edges="signalGraphFocusEdges"
          :node-definitions="signalGraphNodeDefinitions"
          depth-mode="lite"
          :focused-node-id="'focus'"
          show-background
        />
        <UiSignalGraph
          aria-label="Reduced motion graph"
          :nodes="signalGraphOverviewNodes"
          :edges="signalGraphOverviewEdges"
          :node-definitions="signalGraphNodeDefinitions"
          :options="{ motionMode: 'reduced' }"
          show-background
          show-controls
        />
      </div>
    </UiCard>

    <UiCard>
      <template #header>Scoped subtree theme and overlays in nodes</template>
      <section
        class="playground__scoped-surface"
        data-ui-theme="belovodye"
        data-ui-theme-type="light"
      >
        <div class="ui-stack">
          <div class="ui-cluster">
            <UiBadge variant="brand">Belovodye subtree</UiBadge>
            <UiBadge>Theme-aware portal</UiBadge>
            <UiBadge>Overlay interop</UiBadge>
          </div>
          <UiButton size="sm" variant="secondary" @click="replayReducedSignal">
            Replay scoped signals
          </UiButton>
          <UiSignalGraph
            ref="scopedGraphRef"
            aria-label="Scoped theme graph"
            :nodes="signalGraphOverviewNodes"
            :edges="signalGraphOverviewEdges"
            :node-definitions="signalGraphNodeDefinitions"
            :options="{ motionMode: 'reduced' }"
            show-background
          />
        </div>
      </section>
    </UiCard>
  </section>
</template>
