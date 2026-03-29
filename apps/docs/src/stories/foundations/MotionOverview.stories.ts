import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, nextTick, ref } from 'vue';

import { UiBadge, UiButton, UiCard } from '@ww/core';
import {
  MOTION_TAXONOMY,
  MOTION_PRESETS,
  applyTransitionMotionVariables,
  beforeCollapseMotion,
  clearTransitionMotionVariables,
  resolveTransitionMotionPreset,
  runCollapseMotion,
  afterCollapseMotion,
} from '@ww/primitives';
import type { MotionPresetName } from '@ww/primitives';

const taxonomyEntries = Object.entries(MOTION_TAXONOMY);
const durationTokens = [
  '--ui-motion-duration-2xs',
  '--ui-motion-duration-xs',
  '--ui-motion-duration-sm',
  '--ui-motion-duration-md',
  '--ui-motion-duration-lg',
  '--ui-motion-duration-xl',
  '--ui-motion-duration-ambient-sm',
  '--ui-motion-duration-ambient-md',
  '--ui-motion-duration-ambient-lg',
] as const;
const defaultSpeedMultiplier = 3;

const formatMilliseconds = (rawValue: string) => {
  const value = rawValue.trim();
  if (!value) {
    return value;
  }

  if (value.endsWith('ms')) {
    return `${Math.round(Number.parseFloat(value) * 1000) / 1000}ms`;
  }

  if (value.endsWith('s')) {
    return `${Math.round(Number.parseFloat(value) * 1000)}ms`;
  }

  return value;
};

const readDurationValue = (tokenName: string) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return '0ms';
  }

  return window.getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim();
};

const createMotionScopeStyle = (speedMultiplier: number): Record<string, string> =>
  Object.fromEntries(
    durationTokens.map((tokenName) => {
      const currentValue = readDurationValue(tokenName);

      return [
        tokenName,
        currentValue
          ? `calc(${formatMilliseconds(currentValue)} * ${speedMultiplier})`
          : currentValue,
      ];
    })
  );

const meta = {
  title: 'Foundations/Motion Overview',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const UtilitiesAndTokens: StoryObj = {
  render: () => ({
    components: { UiBadge, UiButton, UiCard },
    setup() {
      const speedMultiplier = ref(defaultSpeedMultiplier);
      const utilityRows = [
        { label: 'Lift + focus ring', motion: 'lift-xs ring-focus-soft', tone: 'brand' as const },
        {
          label: 'Underline slide',
          motion: 'underline-slide ring-focus-soft',
          tone: 'warning' as const,
        },
        { label: 'Glow accent', motion: 'glow-accent', tone: 'warning' as const },
        { label: 'Loading shimmer', motion: 'loading-shimmer', tone: 'success' as const },
        { label: 'Shake error', motion: 'shake-error-sm', tone: 'danger' as const },
      ];
      const motionScopeStyle = computed(() => createMotionScopeStyle(speedMultiplier.value));

      return { motionScopeStyle, speedMultiplier, utilityRows };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Motion token scale</template>
          <div
            style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
              gap: var(--ui-space-4);
            "
          >
            <div style="display: grid; gap: var(--ui-space-2);">
              <UiBadge variant="brand">Durations</UiBadge>
              <code>2xs</code>
              <code>xs</code>
              <code>sm</code>
              <code>md</code>
              <code>lg</code>
              <code>xl</code>
            </div>
            <div style="display: grid; gap: var(--ui-space-2);">
              <UiBadge variant="success">Easings</UiBadge>
              <code>standard</code>
              <code>decelerate</code>
              <code>accelerate</code>
              <code>emphasized</code>
              <code>spring-soft</code>
            </div>
            <div style="display: grid; gap: var(--ui-space-2);">
              <UiBadge variant="warning">Distances</UiBadge>
              <code>2xs</code>
              <code>xs</code>
              <code>sm</code>
              <code>md</code>
              <code>lg</code>
              <code>xl</code>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Utility motion demos</template>
          <div class="ui-cluster">
            <label
              style="
                display: grid;
                gap: var(--ui-space-1);
                color: var(--ui-text-secondary);
                font-size: var(--ui-text-font-size-sm);
              "
            >
              <span>Utility speed</span>
              <select v-model.number="speedMultiplier" class="ui-input ui-select__control" style="min-width: 7rem;">
                <option :value="1">1x</option>
                <option :value="2">2x</option>
                <option :value="3">3x</option>
                <option :value="4">4x</option>
                <option :value="5">5x</option>
              </select>
            </label>
            <UiBadge variant="brand">default {{ speedMultiplier }}x slower</UiBadge>
          </div>
          <div
            :style="motionScopeStyle"
            style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
              gap: var(--ui-space-4);
            "
          >
            <div
              v-for="item in utilityRows"
              :key="item.motion"
              style="
                display: grid;
                gap: var(--ui-space-3);
                padding: var(--ui-space-4);
                border: 1px solid var(--ui-border-subtle);
                border-radius: var(--ui-radius-lg);
                background: var(--ui-surface-default);
              "
            >
              <UiBadge :variant="item.tone">{{ item.motion }}</UiBadge>
              <button
                type="button"
                :data-ui-motion="item.motion"
                style="
                  min-height: 3rem;
                  border: 1px solid var(--ui-border-subtle);
                  border-radius: var(--ui-radius-md);
                  background: var(--ui-surface-raised);
                  color: var(--ui-text-primary);
                "
              >
                {{ item.label }}
              </button>
            </div>
          </div>
        </UiCard>
      </div>
    `,
  }),
};

export const PresetLabAndCollapse: StoryObj = {
  render: () => ({
    components: { UiBadge, UiButton, UiCard },
    setup() {
      const presetName = ref<MotionPresetName>('modal-fade-scale');
      const isVisible = ref(true);
      const isCollapsedOpen = ref(true);
      const speedMultiplier = ref(defaultSpeedMultiplier);
      const copied = ref(false);

      const motionScopeStyle = computed<Record<string, string>>(() =>
        createMotionScopeStyle(speedMultiplier.value)
      );

      const currentPreset = computed(() =>
        resolveTransitionMotionPreset(presetName.value, 'fade-in')
      );
      const presetSummary = computed(() =>
        JSON.stringify(
          {
            name: presetName.value,
            speedMultiplier: speedMultiplier.value,
            durationToken: currentPreset.value.durationToken,
            durationValue: formatMilliseconds(readDurationValue(currentPreset.value.durationToken)),
            scaledDuration: `calc(${formatMilliseconds(readDurationValue(currentPreset.value.durationToken))} * ${speedMultiplier.value})`,
            easingToken: currentPreset.value.easingToken,
            properties: currentPreset.value.properties,
            family: currentPreset.value.family,
            layer: currentPreset.value.layer,
            tier: currentPreset.value.tier,
            reducedPreset: currentPreset.value.reducedPreset ?? null,
            enter: currentPreset.value.enter,
            leave: currentPreset.value.leave,
          },
          null,
          2
        )
      );

      const replay = async () => {
        isVisible.value = false;
        await nextTick();
        isVisible.value = true;
      };

      const toggleCollapse = () => {
        isCollapsedOpen.value = !isCollapsedOpen.value;
      };

      const applyPreset = (element: Element, phase: 'enter' | 'leave') => {
        if (!(element instanceof HTMLElement)) {
          return;
        }

        applyTransitionMotionVariables(element, currentPreset.value, phase);

        const durationValue = formatMilliseconds(
          readDurationValue(currentPreset.value.durationToken)
        );
        element.style.setProperty(
          '--ui-motion-duration',
          `calc(${durationValue} * ${speedMultiplier.value})`
        );
      };

      const clearPreset = (element: Element) => {
        if (element instanceof HTMLElement) {
          clearTransitionMotionVariables(element);
          element.style.removeProperty('--ui-motion-duration');
        }
      };

      const beforeEnter = (element: Element) => applyPreset(element, 'enter');
      const beforeLeave = (element: Element) => applyPreset(element, 'leave');
      const afterTransition = (element: Element) => clearPreset(element);

      const beforeCollapseEnter = (element: Element) => {
        if (element instanceof HTMLElement) {
          beforeCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' });
        }
      };
      const enterCollapse = (element: Element, done: () => void) => {
        if (element instanceof HTMLElement) {
          runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
        }
      };
      const beforeCollapseLeave = (element: Element) => {
        if (element instanceof HTMLElement) {
          beforeCollapseMotion(element, { phase: 'leave', preset: 'collapse-y-soft' });
        }
      };
      const leaveCollapse = (element: Element, done: () => void) => {
        if (element instanceof HTMLElement) {
          runCollapseMotion(element, { phase: 'leave', preset: 'collapse-y-soft' }, done);
        }
      };
      const afterCollapse = (element: Element) => {
        if (element instanceof HTMLElement) {
          afterCollapseMotion(element);
        }
      };

      const copyPreset = async () => {
        copied.value = false;

        if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
          return;
        }

        await navigator.clipboard.writeText(presetSummary.value);
        copied.value = true;
        window.setTimeout(() => {
          copied.value = false;
        }, 1600);
      };

      return {
        beforeCollapseEnter,
        beforeCollapseLeave,
        beforeEnter,
        beforeLeave,
        afterCollapse,
        afterTransition,
        enterCollapse,
        isCollapsedOpen,
        isVisible,
        leaveCollapse,
        MOTION_PRESETS,
        copyPreset,
        copied,
        currentPreset,
        motionScopeStyle,
        presetName,
        presetSummary,
        replay,
        speedMultiplier,
        taxonomyEntries,
        toggleCollapse,
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Preset lab</template>
          <div :style="motionScopeStyle" style="display: grid; gap: var(--ui-space-4);">
            <div class="ui-cluster">
              <select v-model="presetName" class="ui-input ui-select__control" style="max-width: 18rem;">
                <option v-for="name in Object.keys(MOTION_PRESETS)" :key="name" :value="name">{{ name }}</option>
              </select>
              <label
                style="
                  display: grid;
                  gap: var(--ui-space-1);
                  color: var(--ui-text-secondary);
                  font-size: var(--ui-text-font-size-sm);
                "
              >
                <span>Speed</span>
                <select v-model.number="speedMultiplier" class="ui-input ui-select__control" style="min-width: 7rem;">
                  <option :value="1">1x</option>
                  <option :value="2">2x</option>
                  <option :value="3">3x</option>
                  <option :value="4">4x</option>
                  <option :value="5">5x</option>
                </select>
              </label>
              <UiButton variant="secondary" @click="replay">Replay preset</UiButton>
              <UiButton tone="info" appearance="outline" @click="copyPreset">
                {{ copied ? 'Copied preset' : 'Copy preset params' }}
              </UiButton>
            </div>
            <div
              style="
                display: grid;
                min-height: 10rem;
                place-items: center;
                border: 1px dashed var(--ui-border-subtle);
                border-radius: var(--ui-radius-xl);
                background: var(--ui-surface-sunken);
              "
            >
              <Transition
                name="ui-motion"
                @before-enter="beforeEnter"
                @after-enter="afterTransition"
                @before-leave="beforeLeave"
                @after-leave="afterTransition"
              >
                <div
                  v-if="isVisible"
                  style="
                    min-width: 15rem;
                    padding: var(--ui-space-5);
                    border: 1px solid var(--ui-border-subtle);
                    border-radius: var(--ui-radius-lg);
                    background: var(--ui-surface-default);
                    box-shadow: var(--ui-elevation-surface-raised);
                  "
                >
                  <strong>{{ presetName }}</strong>
                  <p style="margin: var(--ui-space-2) 0 0;">{{ MOTION_PRESETS[presetName].useCases[0] }}</p>
                </div>
              </Transition>
            </div>
            <div
              style="
                display: grid;
                gap: var(--ui-space-2);
                padding: var(--ui-space-4);
                border: 1px solid var(--ui-border-subtle);
                border-radius: var(--ui-radius-lg);
                background: var(--ui-surface-default);
              "
            >
              <div class="ui-cluster">
                <UiBadge variant="brand">{{ presetName }}</UiBadge>
                <UiBadge>speed {{ speedMultiplier }}x</UiBadge>
                <UiBadge variant="success">{{ currentPreset.durationToken }}</UiBadge>
                <UiBadge variant="warning">{{ currentPreset.easingToken }}</UiBadge>
              </div>
              <pre
                style="
                  margin: 0;
                  overflow: auto;
                  padding: var(--ui-space-3);
                  border-radius: var(--ui-radius-md);
                  background: var(--ui-surface-sunken);
                  color: var(--ui-text-primary);
                  font-size: var(--ui-text-font-size-sm);
                "
              ><code>{{ presetSummary }}</code></pre>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Collapse motion</template>
          <div :style="motionScopeStyle" style="display: grid; gap: var(--ui-space-4);">
            <UiButton variant="secondary" @click="toggleCollapse">
              {{ isCollapsedOpen ? 'Collapse' : 'Expand' }}
            </UiButton>
            <Transition
              @before-enter="beforeCollapseEnter"
              @enter="enterCollapse"
              @after-enter="afterCollapse"
              @before-leave="beforeCollapseLeave"
              @leave="leaveCollapse"
              @after-leave="afterCollapse"
            >
              <div
                v-if="isCollapsedOpen"
                style="
                  padding: var(--ui-space-4);
                  border: 1px solid var(--ui-border-subtle);
                  border-radius: var(--ui-radius-lg);
                  background: var(--ui-surface-default);
                "
              >
                Collapse motion uses the shared runtime, semantic tokens, and reduced-motion fallback.
              </div>
            </Transition>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Preset taxonomy</template>
          <div :style="motionScopeStyle" style="display: grid; gap: var(--ui-space-4);">
            <div
              v-for="[group, names] in taxonomyEntries"
              :key="group"
              style="
                display: grid;
                gap: var(--ui-space-2);
                padding: var(--ui-space-4);
                border: 1px solid var(--ui-border-subtle);
                border-radius: var(--ui-radius-lg);
              "
            >
              <UiBadge variant="brand">{{ group }}</UiBadge>
              <div class="ui-cluster">
                <code v-for="name in names" :key="name">{{ name }}</code>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    `,
  }),
};
