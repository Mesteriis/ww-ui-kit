import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { UiCard } from '@ww/core';
import { UiSignalGraph } from '@ww/signal-graph';

import {
  analysisEdges,
  analysisNodes,
  overviewEdges,
  overviewNodes,
  pipelineEdges,
  pipelineNodes,
  signalGraphNodeDefinitions,
} from './signal-graph-fixtures';

const meta = {
  title: 'Foundations/Signal Graph/Use Cases',
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiSignalGraph>;

export default meta;

export const UseCases: StoryObj<typeof UiSignalGraph> = {
  render: () => ({
    components: { UiCard, UiSignalGraph },
    setup() {
      return {
        analysisEdges,
        analysisNodes,
        nodeDefinitions: signalGraphNodeDefinitions,
        overviewEdges,
        overviewNodes,
        pipelineEdges,
        pipelineNodes,
      };
    },
    template: `
      <div style="display: grid; gap: var(--ui-space-6);">
        <UiCard>
          <template #header>Generic system map</template>
          <UiSignalGraph :nodes="overviewNodes" :edges="overviewEdges" :node-definitions="nodeDefinitions" />
        </UiCard>
        <UiCard>
          <template #header>Generic pipeline</template>
          <UiSignalGraph :nodes="pipelineNodes" :edges="pipelineEdges" :node-definitions="nodeDefinitions" />
        </UiCard>
        <UiCard>
          <template #header>Generic analysis map</template>
          <UiSignalGraph :nodes="analysisNodes" :edges="analysisEdges" :node-definitions="nodeDefinitions" depth-mode="full" :focused-node-id="'focus'" />
        </UiCard>
      </div>
    `,
  }),
};
