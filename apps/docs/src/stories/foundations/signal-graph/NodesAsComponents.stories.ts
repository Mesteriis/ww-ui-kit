import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { UiSignalGraph } from '@ww/signal-graph';

import { overviewEdges, overviewNodes, signalGraphNodeDefinitions } from './signal-graph-fixtures';

const meta = {
  title: 'Foundations/Signal Graph/Nodes as Components',
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiSignalGraph>;

export default meta;

export const NodesAsComponents: StoryObj<typeof UiSignalGraph> = {
  render: () => ({
    components: { UiSignalGraph },
    setup() {
      return {
        edges: overviewEdges,
        nodeDefinitions: signalGraphNodeDefinitions,
        nodes: overviewNodes,
      };
    },
    template: `
      <UiSignalGraph
        aria-label="Signal graph nodes as components"
        :nodes="nodes"
        :edges="edges"
        :node-definitions="nodeDefinitions"
        :focused-node-id="'pipeline'"
        show-background
        show-controls
      />
    `,
  }),
};
