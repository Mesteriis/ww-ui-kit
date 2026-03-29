<script setup lang="ts">
import { computed } from 'vue';

import { PrimitiveVisuallyHidden } from '@ww/primitives';

import type { UiButtonAppearance, UiButtonEffect, UiButtonSize, UiButtonTone, UiButtonVariant } from './button.types';
import { resolveButtonStyle } from './button.types';

defineOptions({ name: 'UiButton' });

const props = withDefaults(
  defineProps<{
    variant?: UiButtonVariant;
    tone?: UiButtonTone;
    appearance?: UiButtonAppearance;
    effect?: UiButtonEffect;
    size?: UiButtonSize;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
  }>(),
  {
    variant: 'primary',
    effect: 'none',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    block: false
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
</script>

<template>
  <button
    class="ui-button"
    :class="[
      `ui-button--tone-${resolvedStyle.tone}`,
      `ui-button--appearance-${resolvedStyle.appearance}`,
      `ui-button--effect-${props.effect}`,
      `ui-button--${props.size}`,
      {
        'ui-button--block': props.block,
        'is-loading': props.loading
      }
    ]"
    :type="props.type"
    :disabled="isDisabled"
    :aria-busy="props.loading || undefined"
    :data-ui-button-tone="resolvedStyle.tone"
    :data-ui-button-appearance="resolvedStyle.appearance"
    :data-ui-button-effect="props.effect"
    data-ui-motion="lift-xs ring-focus-soft"
  >
    <span v-if="$slots.leftIcon && !props.loading" class="ui-button__icon" aria-hidden="true">
      <slot name="leftIcon" />
    </span>
    <span v-if="props.loading" class="ui-button__spinner" aria-hidden="true" />
    <span class="ui-button__content">
      <slot />
    </span>
    <span v-if="$slots.rightIcon && !props.loading" class="ui-button__icon" aria-hidden="true">
      <slot name="rightIcon" />
    </span>
    <PrimitiveVisuallyHidden v-if="props.loading">Loading</PrimitiveVisuallyHidden>
  </button>
</template>
