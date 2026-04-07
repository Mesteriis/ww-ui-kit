import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import {
  UiButton,
  UiCard,
  UiContextMenu,
  UiDialog,
  UiDrawer,
  UiPopconfirm,
  UiPopover,
  UiTooltip,
} from '@ww/core';
import { getThemeMeta } from '@ww/themes';

const meta = {
  title: 'Foundations/Theme Scoped Overlay',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const ScopedThemeAndExplicitTarget: StoryObj = {
  render: () => ({
    components: {
      UiButton,
      UiCard,
      UiContextMenu,
      UiDialog,
      UiDrawer,
      UiPopconfirm,
      UiPopover,
      UiTooltip,
    },
    setup() {
      const contextItems = [
        { label: 'Inspect themed release', value: 'inspect' },
        { label: 'Archive themed release', value: 'archive' },
      ];
      const dialogOpen = ref(false);
      const scopedDrawerOpen = ref(false);
      const drawerOpen = ref(false);
      const popoverOpen = ref(false);
      const explicitPopoverOpen = ref(false);
      const scopedContextAction = ref('none');
      const explicitContextAction = ref('none');
      const scopedPopconfirmOutcome = ref('waiting');
      const explicitPopconfirmOutcome = ref('waiting');
      const explicitPortalTarget = ref<HTMLElement | null>(null);
      const scopedTheme = getThemeMeta('belovodye');

      return {
        contextItems,
        dialogOpen,
        drawerOpen,
        explicitContextAction,
        explicitPopconfirmOutcome,
        explicitPopoverOpen,
        explicitPortalTarget,
        popoverOpen,
        scopedContextAction,
        scopedPopconfirmOutcome,
        scopedDrawerOpen,
        scopedTheme,
      };
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
              <UiTooltip content="Tooltip portals stay inside the nearest themed subtree.">
                <UiButton variant="ghost">Hover tooltip</UiButton>
              </UiTooltip>
              <UiPopover v-model:open="popoverOpen" width="trigger">
                <template #trigger>
                  <UiButton variant="secondary">Open scoped popover</UiButton>
                </template>
                <p style="margin: 0; max-width: 16rem;">
                  Floating overlays inherit Belovodye because the portal host stays inside this themed section.
                </p>
              </UiPopover>
              <UiPopconfirm
                title="Approve Belovodye release?"
                description="The popconfirm portal stays inside the scoped theme host."
                confirm-text="Approve"
                cancel-text="Hold"
                @cancel="scopedPopconfirmOutcome = 'canceled'"
                @confirm="scopedPopconfirmOutcome = 'confirmed'"
              >
                <template #trigger>
                  <UiButton variant="secondary">Scoped popconfirm</UiButton>
                </template>
              </UiPopconfirm>
              <UiContextMenu
                :items="contextItems"
                @select="scopedContextAction = $event.label"
              >
                <template #trigger>
                  <UiButton variant="ghost">Scoped context menu</UiButton>
                </template>
              </UiContextMenu>
            </div>
            <p style="margin: 0;">Scoped popconfirm: {{ scopedPopconfirmOutcome }}</p>
            <p style="margin: 0;">Scoped context action: {{ scopedContextAction }}</p>
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
            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <UiButton variant="secondary" @click="drawerOpen = true">Open drawer in explicit host</UiButton>
              <UiPopover
                v-model:open="explicitPopoverOpen"
                width="trigger"
                :portal-target="explicitPortalTarget"
              >
                <template #trigger>
                  <UiButton variant="secondary">Open popover in explicit host</UiButton>
                </template>
                <p style="margin: 0; max-width: 16rem;">
                  Explicit targets work for floating overlays without managing portal roots manually.
                </p>
              </UiPopover>
              <UiPopconfirm
                title="Ship from explicit host?"
                description="The popconfirm surface mounts into the explicit portal target."
                confirm-text="Ship"
                cancel-text="Wait"
                :portal-target="explicitPortalTarget"
                @cancel="explicitPopconfirmOutcome = 'canceled'"
                @confirm="explicitPopconfirmOutcome = 'confirmed'"
              >
                <template #trigger>
                  <UiButton variant="secondary">Open confirm in explicit host</UiButton>
                </template>
              </UiPopconfirm>
              <UiContextMenu
                :items="contextItems"
                :portal-target="explicitPortalTarget"
                @select="explicitContextAction = $event.label"
              >
                <template #trigger>
                  <UiButton variant="ghost">Open context menu in explicit host</UiButton>
                </template>
              </UiContextMenu>
            </div>
            <p style="margin: 0;">Explicit popconfirm: {{ explicitPopconfirmOutcome }}</p>
            <p style="margin: 0;">Explicit context action: {{ explicitContextAction }}</p>
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
    `,
  }),
};
