import type { Meta, StoryObj } from '@storybook/vue3';

import { UiCard } from '@ww/core';
import { UiSignalGraph } from '@ww/signal-graph';

import { createSignal, overviewEdges, overviewNodes, signalGraphNodeDefinitions } from './signal-graph-fixtures';

const meta = {
  title: 'Foundations/Signal Graph/Reduced Motion',
  tags: ['autodocs'],
} satisfies Meta<typeof UiSignalGraph>;

export default meta;

export const ReducedMotion: StoryObj<typeof UiSignalGraph> = {
  render: () => ({
    components: { UiCard, UiSignalGraph },
    setup() {
      return {
        edges: overviewEdges,
        nodeDefinitions: signalGraphNodeDefinitions,
        nodes: overviewNodes,
        signals: [
          createSignal('gateway-pipeline', 'accent', 'motion'),
          createSignal('worker-overlay', 'warning', 'motion-2', 120),
        ],
      };
    },
    template: `
      <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));">
        <UiCard>
          <template #header>Motion default</template>
          <UiSignalGraph :nodes="nodes" :edges="edges" :node-definitions="nodeDefinitions" :signals="signals" />
        </UiCard>
        <UiCard>
          <template #header>Motion reduced</template>
          <UiSignalGraph
            :nodes="nodes"
            :edges="edges"
            :node-definitions="nodeDefinitions"
            :signals="signals"
            :options="{ motionMode: 'reduced' }"
          />
        </UiCard>
      </div>
    `,
  }),
};
