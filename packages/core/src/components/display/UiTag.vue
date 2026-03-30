<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'UiTag' });

type UiTagVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
type UiTagAppearance = 'soft' | 'outline' | 'solid';
type UiTagSize = 'sm' | 'md' | 'lg';

const props = withDefaults(
  defineProps<{
    label?: string;
    variant?: UiTagVariant;
    appearance?: UiTagAppearance;
    size?: UiTagSize;
    closable?: boolean;
    clickable?: boolean;
    disabled?: boolean;
    rounded?: boolean;
    ellipsis?: boolean;
  }>(),
  {
    appearance: 'soft',
    clickable: false,
    closable: false,
    disabled: false,
    ellipsis: false,
    rounded: true,
    size: 'md',
    variant: 'neutral',
  }
);

const emit = defineEmits<{
  click: [event: MouseEvent];
  close: [event: MouseEvent];
}>();

const rootTag = computed(() => (props.clickable && !props.closable ? 'button' : 'span'));

const onClick = (event: MouseEvent) => {
  if (props.disabled || !props.clickable) {
    return;
  }

  emit('click', event);
};

const onKeydown = (event: KeyboardEvent) => {
  if (!props.clickable || props.disabled || rootTag.value !== 'span') {
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    emit('click', event as unknown as MouseEvent);
  }
};

const onClose = (event: MouseEvent) => {
  event.stopPropagation();
  if (props.disabled) {
    return;
  }

  emit('close', event);
};
</script>

<template>
  <component
    :is="rootTag"
    class="ui-tag"
    :class="[
      `ui-tag--${props.variant}`,
      `ui-tag--${props.appearance}`,
      `ui-tag--${props.size}`,
      {
        'ui-tag--clickable': props.clickable,
        'ui-tag--disabled': props.disabled,
        'ui-tag--ellipsis': props.ellipsis,
        'ui-tag--rounded': props.rounded,
      },
    ]"
    :type="props.clickable && rootTag === 'button' ? 'button' : undefined"
    :disabled="rootTag === 'button' ? props.disabled : undefined"
    :role="props.clickable && rootTag === 'span' ? 'button' : undefined"
    :tabindex="props.clickable && rootTag === 'span' && !props.disabled ? 0 : undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    <span v-if="$slots.icon" class="ui-tag__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="ui-tag__label">
      <slot>
        {{ props.label }}
      </slot>
    </span>
    <button
      v-if="props.closable"
      type="button"
      class="ui-tag__close"
      data-ui-motion="ring-focus-soft"
      aria-label="Remove tag"
      :disabled="props.disabled"
      @click="onClose"
    >
      ×
    </button>
  </component>
</template>
