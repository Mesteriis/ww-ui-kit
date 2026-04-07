import type { StoryObj } from '@storybook/vue3-vite';
import type { Component } from 'vue';
import { linkTo } from '@storybook/addon-links';

import { UiBadge, UiButton, UiCard } from '@ww/core';

import { getCatalogStoryTarget, getStorybookDocsPath } from './catalogStoryTargets';

const catalogComponents: Record<string, Component> = {
  UiBadge: UiBadge as Component,
  UiButton: UiButton as Component,
  UiCard: UiCard as Component,
};

const createCatalogStory = (packageName: string, surfaceName?: string): StoryObj => ({
  ...(surfaceName ? { name: surfaceName } : {}),
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
  render: (_args, context) => ({
    components: catalogComponents,
    setup() {
      const resolvedSurfaceName = surfaceName ?? context.name;
      const target = getCatalogStoryTarget(resolvedSurfaceName);
      const guideHref = target ? getStorybookDocsPath(target.title) : null;
      const labTitle = target?.labTitle ?? target?.title ?? null;
      const openGuide = () => {
        if (!guideHref) {
          return;
        }

        window.parent.location.assign(guideHref);
      };
      const openLab = labTitle ? linkTo(labTitle) : null;

      return {
        guideHref,
        labTitle,
        openGuide,
        openLab,
        packageName,
        surfaceName: resolvedSurfaceName,
        targetTitle: target?.title ?? null,
      };
    },
    template: `
      <UiCard style="max-width: 42rem;">
        <template #header>
          <div style="display: flex; align-items: center; gap: var(--ui-space-2); flex-wrap: wrap;">
            <strong>{{ surfaceName }}</strong>
            <UiBadge variant="brand">{{ packageName }}</UiBadge>
          </div>
        </template>

        <div style="display: grid; gap: var(--ui-space-3);">
          <p style="margin: 0; color: var(--ui-text-secondary);">
            Focused catalog page for the governed public surface.
          </p>
          <p style="margin: 0; color: var(--ui-text-secondary);">
            Registered invariants live in the shell field above. Shared showcase data is intentionally excluded here.
          </p>
          <div v-if="guideHref" class="ui-cluster">
            <UiButton @click="openGuide">Open guide</UiButton>
            <UiButton variant="secondary" @click="openLab">Open live lab</UiButton>
          </div>
          <p v-if="targetTitle" style="margin: 0; color: var(--ui-text-secondary);">
            Canonical guide: <code>{{ targetTitle }}</code>
          </p>
          <p v-if="labTitle && labTitle !== targetTitle" style="margin: 0; color: var(--ui-text-secondary);">
            Storybook lab: <code>{{ labTitle }}</code>
          </p>
          <code>import { {{ surfaceName }} } from '{{ packageName }}'</code>
        </div>
      </UiCard>
    `,
  }),
});

export { createCatalogStory };
