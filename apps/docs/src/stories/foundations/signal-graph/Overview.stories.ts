import type { Meta, StoryObj } from '@storybook/vue3';

import { UiSignalGraph } from '@ww/signal-graph';

import {
  createSignal,
  overviewEdges,
  overviewNodes,
  signalGraphNodeDefinitions,
} from './signal-graph-fixtures';

const meta = {
  title: 'Foundations/Signal Graph/Overview',
  tags: ['autodocs'],
} satisfies Meta<typeof UiSignalGraph>;

export default meta;

export const Overview: StoryObj<typeof UiSignalGraph> = {
  render: () => ({
    components: { UiSignalGraph },
    setup() {
      return {
        edges: overviewEdges,
        nodeDefinitions: signalGraphNodeDefinitions,
        nodes: overviewNodes,
        signals: [
          createSignal('gateway-pipeline', 'info', '1'),
          createSignal('worker-overlay', 'success', '1', 120),
        ],
      };
    },
    template: `
      <UiSignalGraph
        aria-label="Signal graph overview"
        :nodes="nodes"
        :edges="edges"
        :node-definitions="nodeDefinitions"
        :signals="signals"
        show-background
        show-controls
        show-mini-map
      />
    `,
  }),
};
