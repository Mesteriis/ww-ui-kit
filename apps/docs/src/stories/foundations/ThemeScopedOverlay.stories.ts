import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { UiButton, UiCard, UiDialog, UiDrawer } from '@ww/core';
import { getThemeMeta } from '@ww/themes';

const meta = {
  title: 'Foundations/Theme Scoped Overlay',
  tags: ['autodocs']
} satisfies Meta;

export default meta;

export const ScopedThemeAndExplicitTarget: StoryObj = {
  render: () => ({
    components: { UiButton, UiCard, UiDialog, UiDrawer },
    setup() {
      const dialogOpen = ref(false);
      const scopedDrawerOpen = ref(false);
      const drawerOpen = ref(false);
      const explicitPortalTarget = ref<HTMLElement | null>(null);
      const scopedTheme = getThemeMeta('belovodye');

      return { dialogOpen, scopedDrawerOpen, drawerOpen, explicitPortalTarget, scopedTheme };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Scoped theme container</template>
          <section
            :data-ui-theme="scopedTheme.name"
            :data-ui-theme-type="scopedTheme.type"
            style="
              display: grid;
              gap: var(--ui-space-4);
              padding: var(--ui-space-5);
              border-radius: var(--ui-radius-xl);
              background: color-mix(in srgb, var(--ui-surface-default) 94%, var(--ui-brand-50));
              border: 1px solid var(--ui-border-subtle);
            "
          >
            <p style="margin: 0;">Dialog and drawer portals stay inside the nearest themed container instead of escaping to body.</p>
            <p style="margin: 0; color: var(--ui-text-secondary); font-size: var(--ui-text-font-size-sm);">
              Scoped theme: {{ scopedTheme.label }} / {{ scopedTheme.type }}
            </p>
            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <UiButton @click="dialogOpen = true">Open Belovodye dialog</UiButton>
              <UiButton variant="secondary" @click="scopedDrawerOpen = true">Open Belovodye drawer</UiButton>
            </div>
            <UiDialog v-model:open="dialogOpen" title="Scoped dialog">
              The overlay inherits the subtree theme because the portal root is mounted inside this container.
            </UiDialog>
            <UiDrawer v-model:open="scopedDrawerOpen" title="Scoped drawer" side="right">
              This drawer is mounted inside the Belovodye subtree and keeps the same theme variables.
            </UiDrawer>
          </section>
        </UiCard>

        <UiCard>
          <template #header>Explicit portal target</template>
          <div class="ui-stack">
            <div
              ref="explicitPortalTarget"
              style="
                position: relative;
                min-height: 8rem;
                border: 1px dashed var(--ui-border-subtle);
                border-radius: var(--ui-radius-xl);
                padding: var(--ui-space-4);
              "
            >
              Explicit portal host
            </div>
            <UiButton variant="secondary" @click="drawerOpen = true">Open drawer in explicit host</UiButton>
            <UiDrawer
              v-model:open="drawerOpen"
              title="Explicit portal drawer"
              side="right"
              :portal-target="explicitPortalTarget"
            >
              This drawer is mounted into an explicit portal target instead of relying on nearest theme scope.
            </UiDrawer>
          </div>
        </UiCard>
      </div>
    `
  })
};
