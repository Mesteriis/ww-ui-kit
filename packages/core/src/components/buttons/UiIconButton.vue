<script setup lang="ts">
import { computed } from 'vue';

import type { UiButtonAppearance, UiButtonEffect, UiButtonSize, UiButtonTone, UiButtonVariant } from './button.types';
import { resolveButtonStyle } from './button.types';

defineOptions({ name: 'UiIconButton' });

const props = withDefaults(
  defineProps<{
    ariaLabel: string;
    variant?: UiButtonVariant;
    tone?: UiButtonTone;
    appearance?: UiButtonAppearance;
    effect?: UiButtonEffect;
    size?: UiButtonSize;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    variant: 'ghost',
    effect: 'none',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false
  }
);

const isDisabled = computed(() => props.disabled || props.loading);
const resolvedStyle = computed(() =>
  resolveButtonStyle({
    variant: props.variant,
    tone: props.tone,
    appearance: props.appearance
  })
);
const accessibleLabel = computed(() => (props.loading ? `${props.ariaLabel}, loading` : props.ariaLabel));
</script>

<template>
  <button
    class="ui-button ui-button--icon"
    :class="[
      `ui-button--tone-${resolvedStyle.tone}`,
      `ui-button--appearance-${resolvedStyle.appearance}`,
      `ui-button--effect-${props.effect}`,
      `ui-button--${props.size}`,
      { 'is-loading': props.loading }
    ]"
    :type="props.type"
    :disabled="isDisabled"
    :aria-busy="props.loading || undefined"
    :aria-label="accessibleLabel"
    :data-ui-button-tone="resolvedStyle.tone"
    :data-ui-button-appearance="resolvedStyle.appearance"
    :data-ui-button-effect="props.effect"
    data-ui-motion="lift-xs ring-focus-soft"
  >
    <span v-if="props.loading" class="ui-button__spinner" aria-hidden="true" />
    <span v-else class="ui-button__icon" aria-hidden="true">
      <slot />
    </span>
  </button>
</template>
