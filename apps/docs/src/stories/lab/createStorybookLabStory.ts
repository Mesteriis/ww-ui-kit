import type { StoryContext, StoryObj } from '@storybook/vue3-vite';

import type { ThemeName } from '@ww/themes';

import type { LabSurfaceDefinition } from '../../../../../apps/playground/src/lab/manifest/component-lab.types';

import { getStorybookDocsPath } from '../catalog/catalogStoryTargets';
import StorybookLabWorkbench from './StorybookLabWorkbench.vue';
import { getMaintainerLabPath, getSurfaceLabMeta } from './surfaceLabManifest';

type CreateStorybookLabStoryOptions = {
  description?: string;
  guideTitle: string;
  name?: string;
  play?: StoryObj['play'];
  surfaceId: string;
};

function createStorybookLabStory<State extends Record<string, unknown>>(
  definition: LabSurfaceDefinition<State>,
  options: CreateStorybookLabStoryOptions
): StoryObj {
  const surfaceMeta = getSurfaceLabMeta(options.surfaceId);
  const guideHref = getStorybookDocsPath(options.guideTitle);
  const playgroundPath = getMaintainerLabPath(options.surfaceId);

  return {
    ...(options.name ? { name: options.name } : {}),
    ...(options.play ? { play: options.play } : {}),
    parameters: {
      controls: {
        disable: true,
      },
      docs: {
        description: {
          story:
            options.description ??
            'Storybook-side component lab with copy-ready configuration and guided preview modes.',
        },
      },
      storyShell: false,
    },
    render: (_args, context: StoryContext) => ({
      components: {
        StorybookLabWorkbench,
      },
      setup() {
        return {
          definition,
          guideHref,
          guideTitle: options.guideTitle,
          playgroundPath,
          surfaceMeta,
          themeName: context.globals.theme as ThemeName,
        };
      },
      template: `
        <StorybookLabWorkbench
          :definition="definition"
          :guide-href="guideHref"
          :guide-title="guideTitle"
          :playground-path="playgroundPath"
          :surface-meta="surfaceMeta"
          :theme-name="themeName"
        />
      `,
    }),
  };
}

export { createStorybookLabStory };
