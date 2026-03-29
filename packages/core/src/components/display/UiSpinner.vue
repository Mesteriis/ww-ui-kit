<script setup lang="ts">
defineOptions({ name: 'UiSpinner' });

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg';
    label?: string;
  }>(),
  {
    size: 'md',
    label: 'Loading'
  }
);
</script>

<template>
  <span class="ui-spinner" :class="`ui-spinner--${props.size}`" role="status" :aria-label="props.label" />
</template>
