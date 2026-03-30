import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, ref, watch } from 'vue';

import { UiBadge, UiButton, UiCard, UiDialog, UiDrawer } from '@ww/core';
import {
  THEME_CAPABILITY_MATRIX,
  THEME_DENSITIES,
  THEME_MOTION_PROFILES,
  THEME_NAMES,
  THEME_PERSONALITIES,
  getThemeMeta,
  getThemesByType,
  patchThemeRuntime,
  readThemeRuntime,
  type ThemeName,
  type ThemeRuntimeState,
} from '@ww/themes';

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
      const density = ref<(typeof THEME_DENSITIES)[number]>('default');
      const motionProfile = ref<(typeof THEME_MOTION_PROFILES)[number]>('balanced');
      const personality = ref<(typeof THEME_PERSONALITIES)[number]>('neutral');
      const runtimeHost = ref<HTMLElement | null>(null);
      const runtimeState = ref<ThemeRuntimeState | null>(null);
      const subtreeTheme = getThemeMeta('belovodye');
      const allThemes = THEME_NAMES.map(getThemeMeta);
      const currentTheme = computed(() => getThemeMeta(context.globals.theme as ThemeName));
      const lightThemes = getThemesByType('light');
      const darkThemes = getThemesByType('dark');
      const capabilityEntries = [
        ['Foundations', THEME_CAPABILITY_MATRIX.foundations],
        ['Component styles', THEME_CAPABILITY_MATRIX.componentStyles],
        ['Systems', THEME_CAPABILITY_MATRIX.systems],
        ['Density', THEME_CAPABILITY_MATRIX.density],
        ['Typography', THEME_CAPABILITY_MATRIX.typography],
        ['Motion', THEME_CAPABILITY_MATRIX.motion],
        ['Personality', THEME_CAPABILITY_MATRIX.personality],
        ['Responsive', THEME_CAPABILITY_MATRIX.responsive.tokens],
      ] as const;

      const syncRuntime = () => {
        if (!runtimeHost.value) {
          return;
        }

        patchThemeRuntime(
          {
            density: density.value,
            motionProfile: motionProfile.value,
            personality: personality.value,
            themeName: subtreeTheme.name,
          },
          runtimeHost.value
        );
        runtimeState.value = readThemeRuntime(runtimeHost.value);
      };

      watch(runtimeHost, syncRuntime, { flush: 'post' });
      watch([density, motionProfile, personality], syncRuntime);

      return {
        THEME_CAPABILITY_MATRIX,
        THEME_DENSITIES,
        THEME_MOTION_PROFILES,
        THEME_PERSONALITIES,
        allThemes,
        capabilityEntries,
        currentTheme,
        density,
        darkThemes,
        dialogOpen,
        drawerOpen,
        lightThemes,
        motionProfile,
        personality,
        runtimeHost,
        runtimeState,
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
          <template #header>Capability matrix and runtime API</template>
          <div style="display: grid; gap: var(--ui-space-4);">
            <p style="margin: 0;">
              Runtime theming stays DOM-backed. Use <code>patchThemeRuntime()</code> to write
              <code>data-ui-theme</code>, <code>data-ui-density</code>,
              <code>data-ui-motion-profile</code>, and <code>data-ui-personality</code> while
              <code>ThemeType</code> remains derived.
            </p>
            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <UiBadge variant="brand">Root story theme: {{ currentTheme.label }}</UiBadge>
              <UiBadge>Scoped density: {{ runtimeState?.density ?? density }}</UiBadge>
              <UiBadge>Scoped motion: {{ runtimeState?.motionProfile ?? motionProfile }}</UiBadge>
              <UiBadge>Scoped personality: {{ runtimeState?.personality ?? personality }}</UiBadge>
            </div>
            <div style="display: flex; gap: var(--ui-space-3); flex-wrap: wrap;">
              <label style="display: grid; gap: var(--ui-space-1); min-width: 9rem;">
                <span>Density</span>
                <select v-model="density" class="ui-input ui-select__control">
                  <option v-for="option in THEME_DENSITIES" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>
              <label style="display: grid; gap: var(--ui-space-1); min-width: 11rem;">
                <span>Motion profile</span>
                <select v-model="motionProfile" class="ui-input ui-select__control">
                  <option v-for="option in THEME_MOTION_PROFILES" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>
              <label style="display: grid; gap: var(--ui-space-1); min-width: 10rem;">
                <span>Personality</span>
                <select v-model="personality" class="ui-input ui-select__control">
                  <option v-for="option in THEME_PERSONALITIES" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>
            </div>
            <div style="display: grid; gap: var(--ui-space-3); grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));">
              <div
                v-for="[label, tokens] in capabilityEntries"
                :key="label"
                style="
                  display: grid;
                  gap: var(--ui-space-2);
                  padding: var(--ui-space-4);
                  border: 1px solid var(--ui-border-subtle);
                  border-radius: var(--ui-radius-lg);
                  background: var(--ui-surface-default);
                "
              >
                <strong>{{ label }}</strong>
                <code v-for="token in tokens" :key="token">{{ token }}</code>
              </div>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Scoped subtree and overlays</template>
          <section
            ref="runtimeHost"
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
              <UiBadge>ThemeName: {{ runtimeState?.themeName ?? subtreeTheme.name }}</UiBadge>
              <UiBadge>ThemeType: {{ runtimeState?.themeType ?? subtreeTheme.type }}</UiBadge>
              <UiBadge>Density: {{ runtimeState?.density ?? density }}</UiBadge>
              <UiBadge>Motion: {{ runtimeState?.motionProfile ?? motionProfile }}</UiBadge>
              <UiBadge>Personality: {{ runtimeState?.personality ?? personality }}</UiBadge>
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
