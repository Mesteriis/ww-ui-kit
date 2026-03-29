import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, ref } from 'vue';

import { UiBadge, UiButton, UiCard, UiDialog, UiDrawer } from '@ww/core';
import { THEME_NAMES, getThemeMeta, getThemesByType, type ThemeName } from '@ww/themes';

const meta = {
  title: 'Foundations/Theme System Overview',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Overview: StoryObj = {
  render: (_args, context) => ({
    components: { UiBadge, UiButton, UiCard, UiDialog, UiDrawer },
    setup() {
      const dialogOpen = ref(false);
      const drawerOpen = ref(false);
      const subtreeTheme = getThemeMeta('belovodye');
      const allThemes = THEME_NAMES.map(getThemeMeta);
      const currentTheme = computed(() => getThemeMeta(context.globals.theme as ThemeName));
      const lightThemes = getThemesByType('light');
      const darkThemes = getThemesByType('dark');

      return {
        allThemes,
        currentTheme,
        darkThemes,
        dialogOpen,
        drawerOpen,
        lightThemes,
        subtreeTheme,
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Canonical model</template>
          <div style="display: grid; gap: var(--ui-space-4);">
            <p style="margin: 0;">
              Theme names are concrete themes. Theme type is derived metadata and never a free second axis.
            </p>
            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <UiBadge variant="brand">Current theme: {{ currentTheme.label }}</UiBadge>
              <UiBadge>ThemeName: {{ currentTheme.name }}</UiBadge>
              <UiBadge>ThemeType: {{ currentTheme.type }}</UiBadge>
            </div>
            <code>data-ui-theme="{{ currentTheme.name }}" data-ui-theme-type="{{ currentTheme.type }}"</code>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Registry</template>
          <div style="display: grid; gap: var(--ui-space-4);">
            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <UiBadge variant="brand">Light themes: {{ lightThemes.map((theme) => theme.name).join(', ') }}</UiBadge>
              <UiBadge variant="danger">Dark themes: {{ darkThemes.map((theme) => theme.name).join(', ') }}</UiBadge>
            </div>
            <div style="display: grid; gap: var(--ui-space-3); grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));">
              <div
                v-for="theme in allThemes"
                :key="theme.name"
                style="
                  display: grid;
                  gap: var(--ui-space-2);
                  padding: var(--ui-space-4);
                  border: 1px solid var(--ui-border-subtle);
                  border-radius: var(--ui-radius-lg);
                  background: var(--ui-surface-default);
                "
              >
                <strong>{{ theme.label }}</strong>
                <span>name: {{ theme.name }}</span>
                <span>type: {{ theme.type }}</span>
              </div>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Scoped subtree and overlays</template>
          <section
            :data-ui-theme="subtreeTheme.name"
            :data-ui-theme-type="subtreeTheme.type"
            style="
              display: grid;
              gap: var(--ui-space-4);
              padding: var(--ui-space-5);
              border: 1px solid var(--ui-border-subtle);
              border-radius: var(--ui-radius-xl);
              background:
                radial-gradient(circle at top right, var(--ui-surface-brand-soft), transparent 36%),
                linear-gradient(180deg, var(--ui-surface-canvas), var(--ui-surface-default));
            "
          >
            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <UiBadge variant="brand">{{ subtreeTheme.label }}</UiBadge>
              <UiBadge>ThemeName: {{ subtreeTheme.name }}</UiBadge>
              <UiBadge>ThemeType: {{ subtreeTheme.type }}</UiBadge>
            </div>
            <p style="margin: 0;">
              Dialog and drawer opened from this subtree preserve both attributes through the theme-aware portal root.
            </p>
            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <UiButton @click="dialogOpen = true">Open scoped dialog</UiButton>
              <UiButton variant="secondary" @click="drawerOpen = true">Open scoped drawer</UiButton>
            </div>
            <UiDialog v-model:open="dialogOpen" title="Scoped dialog">
              This overlay keeps <code>data-ui-theme</code> and <code>data-ui-theme-type</code> in sync.
            </UiDialog>
            <UiDrawer v-model:open="drawerOpen" title="Scoped drawer" side="right">
              The drawer inherits the same subtree theme metadata and surface variables.
            </UiDrawer>
          </section>
        </UiCard>
      </div>
    `,
  }),
};
