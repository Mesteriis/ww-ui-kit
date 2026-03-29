<script setup lang="ts">
defineOptions({ name: 'UiBadge' });

const props = withDefaults(
  defineProps<{
    variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
  }>(),
  {
    variant: 'neutral'
  }
);
</script>

<template>
  <span class="ui-badge" :class="`ui-badge--${props.variant}`" data-ui-motion="ring-focus-soft">
    <slot />
  </span>
</template>
