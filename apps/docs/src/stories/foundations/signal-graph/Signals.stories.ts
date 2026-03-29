import { defineComponent, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import { UiButton } from '@ww/core';
import { UiSignalGraph, type SignalGraphHandle } from '@ww/signal-graph';

import {
  createSignal,
  overviewEdges,
  overviewNodes,
  signalGraphNodeDefinitions,
} from './signal-graph-fixtures';

const meta = {
  title: 'Foundations/Signal Graph/Signals',
  tags: ['autodocs'],
} satisfies Meta<typeof UiSignalGraph>;

export default meta;

export const Signals: StoryObj<typeof UiSignalGraph> = {
  render: () =>
    defineComponent({
      components: { UiButton, UiSignalGraph },
      setup() {
        const graphRef = ref<SignalGraphHandle | null>(null);
        const emitVariant = (variant: 'info' | 'success' | 'warning' | 'danger' | 'accent') => {
          graphRef.value?.emitSignal([
            createSignal('gateway-pipeline', variant, 'story'),
            createSignal('gateway-pipeline', variant, 'story-follow-up', 90),
            createSignal('worker-overlay', variant, 'story-secondary', 180),
          ]);
        };

        return {
          edges: overviewEdges,
          emitVariant,
          graphRef,
          nodeDefinitions: signalGraphNodeDefinitions,
          nodes: overviewNodes,
        };
      },
      template: `
        <div class="ui-stack" style="gap: var(--ui-space-4);">
          <div class="ui-cluster">
            <UiButton size="sm" @click="emitVariant('info')">Info</UiButton>
            <UiButton size="sm" @click="emitVariant('success')">Success</UiButton>
            <UiButton size="sm" @click="emitVariant('warning')">Warning</UiButton>
            <UiButton size="sm" @click="emitVariant('danger')">Danger</UiButton>
            <UiButton size="sm" @click="emitVariant('accent')">Accent</UiButton>
          </div>
          <UiSignalGraph
            ref="graphRef"
            aria-label="Signal graph signal runtime"
            :nodes="nodes"
            :edges="edges"
            :node-definitions="nodeDefinitions"
            show-background
          />
        </div>
      `,
    }),
};
