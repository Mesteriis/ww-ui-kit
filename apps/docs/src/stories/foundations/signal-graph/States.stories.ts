import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { UiCard } from '@ww/core';
import { UiSignalGraph } from '@ww/signal-graph';

import { overviewEdges, overviewNodes, signalGraphNodeDefinitions } from './signal-graph-fixtures';

const meta = {
  title: 'Foundations/Signal Graph/States',
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiSignalGraph>;

export default meta;

export const States: StoryObj<typeof UiSignalGraph> = {
  render: () => ({
    components: { UiCard, UiSignalGraph },
    setup() {
      return {
        edges: overviewEdges,
        nodeDefinitions: signalGraphNodeDefinitions,
        nodes: overviewNodes,
      };
    },
    template: `
      <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));">
        <UiCard>
          <template #header>Loading</template>
          <UiSignalGraph loading :nodes="nodes" :edges="edges" :node-definitions="nodeDefinitions" />
        </UiCard>
        <UiCard>
          <template #header>Empty</template>
          <UiSignalGraph :nodes="[]" :edges="[]" :node-definitions="nodeDefinitions" empty-text="No signal relationships yet." />
        </UiCard>
        <UiCard>
          <template #header>Error</template>
          <UiSignalGraph error="Graph adapter failed." :nodes="nodes" :edges="edges" :node-definitions="nodeDefinitions" />
        </UiCard>
      </div>
    `,
  }),
};
