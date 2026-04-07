import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Workspace/Canvas',
  parameters: {
    storyShell: false,
    controls: {
      hideNoControlsWarning: true,
    },
  },
} satisfies Meta;

export default meta;

export const Canvas: StoryObj = {
  render: () => ({
    template: `
      <section
        style="
          min-block-size: 24rem;
          inline-size: 100%;
        "
      />
      <div>test</div>
    `,
  }),
};
