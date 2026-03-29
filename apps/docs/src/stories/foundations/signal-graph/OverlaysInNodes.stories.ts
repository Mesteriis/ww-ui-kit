import type { Meta, StoryObj } from '@storybook/vue3';

import { UiSignalGraph } from '@ww/signal-graph';

import { overviewEdges, overviewNodes, signalGraphNodeDefinitions } from './signal-graph-fixtures';

const meta = {
  title: 'Foundations/Signal Graph/Overlays in Nodes',
  tags: ['autodocs'],
} satisfies Meta<typeof UiSignalGraph>;

export default meta;

export const OverlaysInNodes: StoryObj<typeof UiSignalGraph> = {
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
      <section data-ui-theme="belovodye" data-ui-theme-type="light" style="padding: var(--ui-space-4); border-radius: var(--ui-radius-xl); background: var(--ui-surface-canvas);">
        <UiSignalGraph
          aria-label="Signal graph overlays in themed nodes"
          :nodes="nodes"
          :edges="edges"
          :node-definitions="nodeDefinitions"
          show-background
        />
      </section>
    `,
  }),
};
