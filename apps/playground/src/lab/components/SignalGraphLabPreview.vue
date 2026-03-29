<script setup lang="ts">
import { computed, ref, type Component } from 'vue';

import { UiBadge, UiButton } from '@ww/core';
import {
  UiSignalGraph,
  type SignalGraphHandle,
  type SignalGraphSignal,
  type UiSignalGraphProps,
} from '@ww/signal-graph';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';

defineOptions({ name: 'SignalGraphLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

const graphRef = ref<SignalGraphHandle | null>(null);

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      graphProps: UiSignalGraphProps;
      wrapperAttrs?: Record<string, unknown>;
      signalBursts?: readonly {
        id: string;
        label: string;
        signals: readonly SignalGraphSignal[];
      }[];
    }
);

const graphComponent = UiSignalGraph as Component;

const emitSignals = (signals: readonly SignalGraphSignal[]) => {
  graphRef.value?.emitSignal([...signals]);
};
</script>

<template>
  <div class="lab-preview lab-preview--signal-graph" data-lab-preview-canvas="signal-graph">
    <section class="lab-preview__signal-graph-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <div class="ui-stack">
        <div v-if="resolved?.signalBursts?.length" class="ui-cluster">
          <UiBadge variant="brand">Signal bursts</UiBadge>
          <UiButton
            v-for="burst in resolved.signalBursts"
            :key="burst.id"
            size="sm"
            variant="secondary"
            @click="emitSignals(burst.signals)"
          >
            {{ burst.label }}
          </UiButton>
        </div>
        <component :is="graphComponent" ref="graphRef" v-bind="resolved?.graphProps ?? {}" />
      </div>
    </section>
  </div>
</template>
