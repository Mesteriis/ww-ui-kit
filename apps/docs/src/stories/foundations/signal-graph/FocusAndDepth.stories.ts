import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { UiCard } from '@ww/core';
import { UiSignalGraph } from '@ww/signal-graph';

import { analysisEdges, analysisNodes, signalGraphNodeDefinitions } from './signal-graph-fixtures';

const meta = {
  title: 'Foundations/Signal Graph/Focus and Depth',
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiSignalGraph>;

export default meta;

export const FocusAndDepth: StoryObj<typeof UiSignalGraph> = {
  render: () => ({
    components: { UiCard, UiSignalGraph },
    setup() {
      return {
        edges: analysisEdges,
        nodeDefinitions: signalGraphNodeDefinitions,
        nodes: analysisNodes,
      };
    },
    template: `
      <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));">
        <UiCard>
          <template #header>Depth off</template>
          <UiSignalGraph :nodes="nodes" :edges="edges" :node-definitions="nodeDefinitions" depth-mode="off" :focused-node-id="'focus'" />
        </UiCard>
        <UiCard>
          <template #header>Depth lite</template>
          <UiSignalGraph :nodes="nodes" :edges="edges" :node-definitions="nodeDefinitions" depth-mode="lite" :focused-node-id="'focus'" />
        </UiCard>
        <UiCard>
          <template #header>Depth full</template>
          <UiSignalGraph :nodes="nodes" :edges="edges" :node-definitions="nodeDefinitions" depth-mode="full" :focused-node-id="'focus'" />
        </UiCard>
      </div>
    `,
  }),
};
