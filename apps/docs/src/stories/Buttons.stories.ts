import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { UiButton, UiButtonGroup, UiIconButton } from '@ww/core';

const meta = {
  title: 'Core/Scenarios/Buttons',
  component: UiButton,
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiButton>;

export default meta;

function createInteractionTracker() {
  const interactionCount = ref(0);
  const lastInteraction = ref('No interactions yet');

  const trackInteraction = (event: MouseEvent | KeyboardEvent) => {
    const isKeyboardInteraction = event instanceof KeyboardEvent;

    if (isKeyboardInteraction) {
      const key = event.key;
      if (key !== 'Enter' && key !== ' ' && key !== 'Spacebar') {
        return;
      }
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const buttonElement = target.closest('button');
    if (!(buttonElement instanceof HTMLButtonElement) || buttonElement.disabled) {
      return;
    }

    const source = !isKeyboardInteraction
      ? 'click'
      : event.key === ' ' || event.key === 'Spacebar'
        ? 'keyboard Space'
        : 'keyboard Enter';
    const label =
      buttonElement.getAttribute('aria-label') ??
      buttonElement.textContent?.trim() ??
      'Unnamed button';
    const tone = buttonElement.dataset.uiButtonTone ?? 'n/a';
    const appearance = buttonElement.dataset.uiButtonAppearance ?? 'n/a';
    const effect = buttonElement.dataset.uiButtonEffect ?? 'none';

    interactionCount.value += 1;
    lastInteraction.value = `${interactionCount.value}. ${source}: ${label} (tone=${tone}, appearance=${appearance}, effect=${effect})`;
  };

  return {
    lastInteraction,
    trackInteraction,
  };
}

export const Variants: StoryObj<typeof UiButton> = {
  render: () => ({
    components: { UiButton },
    setup() {
      const legacyVariants = [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Ghost', value: 'ghost' },
        { label: 'Danger', value: 'danger' },
      ] as const;

      const tones = [
        { label: 'Neutral', value: 'neutral' },
        { label: 'Brand', value: 'brand' },
        { label: 'Debug', value: 'debug' },
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' },
        { label: 'Critical', value: 'critical' },
      ] as const;
      const { lastInteraction, trackInteraction } = createInteractionTracker();

      return {
        legacyVariants,
        tones,
        lastInteraction,
        trackInteraction,
      };
    },
    template: `
      <div class="ui-stack" @click="trackInteraction" @keydown="trackInteraction">
        <div class="ui-cluster">
          <UiButton
            v-for="variant in legacyVariants"
            :key="\`variant-\${variant.value}\`"
            :variant="variant.value"
          >
            {{ variant.label }}
          </UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton v-for="tone in tones" :key="\`solid-\${tone.value}\`" :tone="tone.value">
            {{ tone.label }}
          </UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton
            v-for="tone in tones"
            :key="\`outline-\${tone.value}\`"
            :tone="tone.value"
            appearance="outline"
          >
            {{ tone.label }} outline
          </UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton
            v-for="tone in tones"
            :key="\`ghost-\${tone.value}\`"
            :tone="tone.value"
            appearance="ghost"
          >
            {{ tone.label }} ghost
          </UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton tone="trace">Trace alias</UiButton>
          <UiButton tone="warn">Warn alias</UiButton>
          <UiButton tone="error">Error alias</UiButton>
          <UiButton tone="fatal">Fatal alias</UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton tone="debug" appearance="outline" effect="border-flow">
            Debug gradient border
          </UiButton>
          <UiButton tone="critical" appearance="outline" effect="border-flow">
            Critical gradient border
          </UiButton>
        </div>
        <p style="margin: 0; color: var(--ui-text-secondary);">
          Last interaction: {{ lastInteraction }}
        </p>
      </div>
    `,
  }),
};

export const AppearancesAndEffects: StoryObj<typeof UiButton> = {
  render: () => ({
    components: { UiButton },
    template: `
      <div class="ui-stack">
        <div class="ui-cluster">
          <UiButton tone="info" appearance="outline">Info outline</UiButton>
          <UiButton tone="warning" appearance="outline">Warning outline</UiButton>
          <UiButton tone="critical" appearance="outline">Critical outline</UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton tone="debug" effect="border-flow">Debug border flow</UiButton>
          <UiButton tone="brand" effect="color-shift">Brand color shift</UiButton>
          <UiButton tone="critical" appearance="outline" effect="border-flow">
            Critical border flow
          </UiButton>
        </div>
      </div>
    `,
  }),
};

export const LoadingAndSizes: StoryObj<typeof UiButton> = {
  render: () => ({
    components: { UiButton, UiIconButton },
    template: `
      <div class="ui-stack">
        <div class="ui-cluster">
          <UiButton size="sm">Small</UiButton>
          <UiButton size="md" loading>Loading</UiButton>
          <UiButton size="lg" block>Block action</UiButton>
        </div>
        <div class="ui-cluster">
          <UiIconButton ariaLabel="Add item">+</UiIconButton>
          <UiIconButton ariaLabel="Open logs" tone="warning" appearance="outline">!</UiIconButton>
          <UiIconButton ariaLabel="Refresh" tone="debug" effect="color-shift" loading />
        </div>
      </div>
    `,
  }),
};

export const Groups: StoryObj<typeof UiButton> = {
  render: () => ({
    components: { UiButton, UiButtonGroup, UiIconButton },
    setup() {
      const activeAction = ref('review');

      return {
        activeAction,
      };
    },
    template: `
      <div class="ui-stack">
        <UiButtonGroup aria-label="Release actions">
          <UiButton
            :variant="activeAction === 'review' ? 'primary' : 'secondary'"
            @click="activeAction = 'review'"
          >
            Review
          </UiButton>
          <UiButton
            :variant="activeAction === 'ship' ? 'primary' : 'secondary'"
            @click="activeAction = 'ship'"
          >
            Ship
          </UiButton>
          <UiButton
            :variant="activeAction === 'rollback' ? 'danger' : 'secondary'"
            @click="activeAction = 'rollback'"
          >
            Rollback
          </UiButton>
        </UiButtonGroup>

        <p style="margin: 0;">Active group action: {{ activeAction }}</p>

        <UiButtonGroup orientation="vertical" :attached="false" style="max-width: 12rem;">
          <UiButton variant="secondary">Queue</UiButton>
          <UiButton variant="secondary">Approve</UiButton>
          <UiIconButton ariaLabel="Open history" tone="info" appearance="outline">⌘</UiIconButton>
        </UiButtonGroup>
      </div>
    `,
  }),
};

export const GroupEdgeCases: StoryObj<typeof UiButton> = {
  render: () => ({
    components: { UiButton, UiButtonGroup, UiIconButton },
    template: `
      <div class="ui-stack">
        <UiButtonGroup block aria-label="Pipeline filters">
          <UiButton variant="secondary">Queued</UiButton>
          <UiButton>Active</UiButton>
          <UiButton variant="danger" :disabled="true">Blocked</UiButton>
        </UiButtonGroup>

        <UiButtonGroup :attached="false" wrap aria-label="Responsive actions" style="max-width: 18rem;">
          <UiButton size="sm">Logs</UiButton>
          <UiButton size="sm" variant="secondary">Preview</UiButton>
          <UiButton size="sm" variant="ghost">Share</UiButton>
          <UiIconButton ariaLabel="Pin" size="sm">★</UiIconButton>
        </UiButtonGroup>
      </div>
    `,
  }),
};

export const AllVariantsAndProps: StoryObj<typeof UiButton> = {
  render: () => ({
    components: { UiButton, UiButtonGroup, UiIconButton },
    setup() {
      const tones = [
        { label: 'Neutral', value: 'neutral' },
        { label: 'Brand', value: 'brand' },
        { label: 'Debug', value: 'debug' },
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' },
        { label: 'Critical', value: 'critical' },
      ] as const;
      const { lastInteraction, trackInteraction } = createInteractionTracker();

      return {
        tones,
        lastInteraction,
        trackInteraction,
      };
    },
    template: `
      <div class="ui-stack" @click="trackInteraction" @keydown="trackInteraction">
        <p style="margin: 0; color: var(--ui-text-secondary);">
          Last interaction: {{ lastInteraction }}
        </p>
        <p style="margin: 0; font-weight: 600;">UiButton variants</p>
        <div class="ui-cluster">
          <UiButton variant="primary">Primary</UiButton>
          <UiButton variant="secondary">Secondary</UiButton>
          <UiButton variant="ghost">Ghost</UiButton>
          <UiButton variant="danger">Danger</UiButton>
        </div>

        <p style="margin: 0; font-weight: 600;">UiButton tone + appearance</p>
        <div class="ui-cluster">
          <UiButton v-for="tone in tones" :key="\`all-solid-\${tone.value}\`" :tone="tone.value">
            {{ tone.label }} solid
          </UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton
            v-for="tone in tones"
            :key="\`all-outline-\${tone.value}\`"
            :tone="tone.value"
            appearance="outline"
          >
            {{ tone.label }} outline
          </UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton
            v-for="tone in tones"
            :key="\`all-ghost-\${tone.value}\`"
            :tone="tone.value"
            appearance="ghost"
          >
            {{ tone.label }} ghost
          </UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton tone="trace">Trace alias</UiButton>
          <UiButton tone="warn">Warn alias</UiButton>
          <UiButton tone="error">Error alias</UiButton>
          <UiButton tone="fatal">Fatal alias</UiButton>
        </div>

        <p style="margin: 0; font-weight: 600;">UiButton effects, sizes, states, type, slots</p>
        <div class="ui-cluster">
          <UiButton tone="brand" effect="none">No effect</UiButton>
          <UiButton tone="warning" appearance="outline" effect="none">Outline no effect</UiButton>
          <UiButton tone="debug" effect="border-flow">Border flow</UiButton>
          <UiButton tone="info" effect="color-shift">Color shift</UiButton>
        </div>
        <div class="ui-cluster">
          <UiButton size="sm">Small</UiButton>
          <UiButton size="md">Medium</UiButton>
          <UiButton size="lg">Large</UiButton>
          <UiButton size="md" loading>Loading</UiButton>
          <UiButton size="md" :disabled="true">Disabled</UiButton>
          <UiButton size="lg" block>Block</UiButton>
        </div>
        <form class="ui-cluster" @submit.prevent @reset.prevent>
          <UiButton type="button" variant="secondary">Type button</UiButton>
          <UiButton type="submit">Type submit</UiButton>
          <UiButton type="reset" variant="ghost">Type reset</UiButton>
        </form>
        <div class="ui-cluster">
          <UiButton tone="brand">
            <template #leftIcon>←</template>
            Left icon
          </UiButton>
          <UiButton tone="success">
            Right icon
            <template #rightIcon>→</template>
          </UiButton>
          <UiButton tone="warning">
            <template #leftIcon>←</template>
            Both icons
            <template #rightIcon>→</template>
          </UiButton>
        </div>

        <p style="margin: 0; font-weight: 600;">UiIconButton props</p>
        <div class="ui-cluster">
          <UiIconButton ariaLabel="Icon primary" variant="primary">P</UiIconButton>
          <UiIconButton ariaLabel="Icon secondary" variant="secondary">S</UiIconButton>
          <UiIconButton ariaLabel="Icon ghost" variant="ghost">G</UiIconButton>
          <UiIconButton ariaLabel="Icon danger" variant="danger">D</UiIconButton>
        </div>
        <div class="ui-cluster">
          <UiIconButton ariaLabel="Icon outline warning" tone="warning" appearance="outline">
            !
          </UiIconButton>
          <UiIconButton ariaLabel="Icon ghost info" tone="info" appearance="ghost">i</UiIconButton>
          <UiIconButton ariaLabel="Icon border flow" tone="debug" effect="border-flow">#</UiIconButton>
          <UiIconButton ariaLabel="Icon color shift" tone="brand" effect="color-shift">$</UiIconButton>
        </div>
        <div class="ui-cluster">
          <UiIconButton ariaLabel="Icon small" size="sm">s</UiIconButton>
          <UiIconButton ariaLabel="Icon medium" size="md">m</UiIconButton>
          <UiIconButton ariaLabel="Icon large" size="lg">l</UiIconButton>
          <UiIconButton ariaLabel="Icon disabled" :disabled="true">x</UiIconButton>
          <UiIconButton ariaLabel="Icon loading" loading />
        </div>
        <form class="ui-cluster" @submit.prevent @reset.prevent>
          <UiIconButton ariaLabel="Icon submit" type="submit" variant="secondary">↵</UiIconButton>
          <UiIconButton ariaLabel="Icon reset" type="reset" variant="ghost">↺</UiIconButton>
        </form>

        <p style="margin: 0; font-weight: 600;">UiButtonGroup props</p>
        <div class="ui-stack" style="gap: var(--ui-space-3);">
          <UiButtonGroup ariaLabel="Horizontal attached group">
            <UiButton variant="secondary">Review</UiButton>
            <UiButton>Ship</UiButton>
            <UiButton variant="danger">Rollback</UiButton>
          </UiButtonGroup>

          <UiButtonGroup orientation="vertical" :attached="false" ariaLabel="Vertical detached group">
            <UiButton variant="secondary">Queue</UiButton>
            <UiButton variant="secondary">Approve</UiButton>
            <UiIconButton ariaLabel="Open history" tone="info" appearance="outline">⌘</UiIconButton>
          </UiButtonGroup>

          <UiButtonGroup wrap :attached="false" ariaLabel="Wrapping group" style="max-width: 18rem;">
            <UiButton size="sm">Logs</UiButton>
            <UiButton size="sm" variant="secondary">Preview</UiButton>
            <UiButton size="sm" variant="ghost">Share</UiButton>
            <UiIconButton ariaLabel="Pin release" size="sm">★</UiIconButton>
          </UiButtonGroup>

          <UiButtonGroup block ariaLabel="Block group">
            <UiButton variant="secondary">Queued</UiButton>
            <UiButton>Active</UiButton>
            <UiButton variant="danger">Blocked</UiButton>
          </UiButtonGroup>

          <div class="ui-stack" style="gap: var(--ui-space-2);">
            <p id="button-group-proof-label" style="margin: 0;">Group labelledby contract</p>
            <UiButtonGroup ariaLabelledby="button-group-proof-label">
              <UiButton variant="secondary">Read ADR</UiButton>
              <UiButton>Ship</UiButton>
            </UiButtonGroup>
          </div>
        </div>
      </div>
    `,
  }),
};
