import type { Meta, StoryObj } from '@storybook/vue3';

import { UiSignalGraph } from '@ww/signal-graph';

import { overviewEdges, overviewNodes, signalGraphNodeDefinitions } from './signal-graph-fixtures';

const meta = {
  title: 'Foundations/Signal Graph/Theming',
  tags: ['autodocs'],
} satisfies Meta<typeof UiSignalGraph>;

export default meta;

export const Theming: StoryObj<typeof UiSignalGraph> = {
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
      <div style="display: grid; gap: var(--ui-space-6);">
        <section data-ui-theme="light" data-ui-theme-type="light" style="padding: var(--ui-space-4); border-radius: var(--ui-radius-xl); background: var(--ui-surface-canvas);">
          <UiSignalGraph aria-label="Light scoped signal graph" :nodes="nodes" :edges="edges" :node-definitions="nodeDefinitions" />
        </section>
        <section data-ui-theme="dark" data-ui-theme-type="dark" style="padding: var(--ui-space-4); border-radius: var(--ui-radius-xl); background: var(--ui-surface-canvas);">
          <UiSignalGraph aria-label="Dark scoped signal graph" :nodes="nodes" :edges="edges" :node-definitions="nodeDefinitions" />
        </section>
        <section data-ui-theme="belovodye" data-ui-theme-type="dark" style="padding: var(--ui-space-4); border-radius: var(--ui-radius-xl); background: var(--ui-surface-canvas);">
          <UiSignalGraph aria-label="Belovodye scoped signal graph" :nodes="nodes" :edges="edges" :node-definitions="nodeDefinitions" />
        </section>
      </div>
    `,
  }),
};
